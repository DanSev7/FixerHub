// File: controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const supabase = require('../config/db');
const { sendVerificationEmail } = require('../utils/email');
const { validateSignup, validateLogin } = require('../utils/validators');

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Fallback for development
const JWT_EXPIRES_IN = '7d'; // 7 days expiration

const signup = async (req, res, next) => {
  try {
    const { error: validationError } = validateSignup(req.body);
    if (validationError) return res.status(400).json({ error: validationError.details[0].message });

    const { username, email, phone_number, password, role } = req.body;
    if (!role || !['client', 'professional'].includes(role)) {
      return res.status(400).json({ error: 'Role must be either "client" or "professional"' });
    }

    // Check if email already exists
    const { data: existingUser, error: existingError } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();
    if (existingError && existingError.code !== 'PGRST116') {
      console.error('Email check error:', existingError);
      return res.status(500).json({ error: 'Email check failed' });
    }
    if (existingUser) return res.status(400).json({ error: 'Email already registered' });

    // Generate OTP and hash password
    const verification_otp = Math.floor(100000 + Math.random() * 900000).toString();
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Delete any existing verification for this email
    const { error: deleteError } = await supabase
      .from('email_verifications')
      .delete()
      .eq('email', email);
    if (deleteError) {
      console.error('Delete existing verification error:', deleteError);
      throw deleteError;
    }

    // Insert user into users table
    const { data, error: insertError } = await supabase
      .from('users')
      .insert({
        user_id: require('crypto').randomUUID(),
        username,
        email,
        phone_number,
        password_hash,
        role,
        is_verified: false,
        verification_otp,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert user error:', insertError);
      if (insertError.message.includes('verification_otp')) {
        return res.status(500).json({ error: 'Database schema error: verification_otp column missing' });
      }
      throw insertError;
    }

    // Insert OTP into email_verifications table
    const { error: otpError } = await supabase
      .from('email_verifications')
      .insert({
        email,
        otp: verification_otp,
        created_at: new Date(),
      });
    if (otpError) {
      console.error('Insert OTP error:', otpError);
      throw otpError;
    }

    // Send verification email
    await sendVerificationEmail(email, verification_otp);

    res.status(201).json({ message: `${role.charAt(0).toUpperCase() + role.slice(1)} registered. Verify your email.`, email });
  } catch (err) {
    console.error('Signup error:', err);
    next(err);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: 'Email and OTP are required' });

    // Check OTP in users table
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('user_id, is_verified, verification_otp, role')
      .eq('email', email)
      .eq('verification_otp', otp)
      .eq('is_verified', false)
      .single();
    if (fetchError || !user) {
      console.error('Fetch user error:', fetchError);
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Update user as verified
    const { error: updateError } = await supabase
      .from('users')
      .update({ is_verified: true, verification_otp: null, updated_at: new Date() })
      .eq('user_id', user.user_id);
    if (updateError) {
      console.error('Update user error:', updateError);
      if (updateError.message.includes('verification_otp')) {
        return res.status(500).json({ error: 'Database schema error: verification_otp column missing' });
      }
      throw updateError;
    }

    // Remove OTP from email_verifications
    const { error: deleteOtpError } = await supabase
      .from('email_verifications')
      .delete()
      .eq('email', email)
      .eq('otp', otp);
    if (deleteOtpError) {
      console.error('Delete OTP error:', deleteOtpError);
      throw deleteOtpError;
    }

    // Generate JWT
    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    res.json({ message: 'Email verified successfully', token, role: user.role });
  } catch (err) {
    console.error('Verify email error:', err);
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { error: validationError } = validateLogin(req.body);
    if (validationError) return res.status(400).json({ error: validationError.details[0].message });

    const { email, password } = req.body;

    // Fetch user
    const { data: user, error: profileError } = await supabase
      .from('users')
      .select('user_id, password_hash, role, is_verified')
      .eq('email', email)
      .single();
    if (profileError || !user) {
      console.error('Fetch user error:', profileError);
      return res.status(400).json({ error: 'User not found' });
    }
    if (!user.is_verified) return res.status(400).json({ error: 'Email not verified' });

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) return res.status(400).json({ error: 'Invalid credentials' });

    // Generate JWT
    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    next(err);
  }
};

const resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    // Check if user exists and is not verified
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('user_id, is_verified')
      .eq('email', email)
      .eq('is_verified', false)
      .single();
    if (fetchError || !user) {
      console.error('Fetch user error:', fetchError);
      return res.status(400).json({ error: 'User not found or already verified' });
    }

    // Generate new OTP
    const verification_otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Update OTP in users table
    const { error: updateError } = await supabase
      .from('users')
      .update({ verification_otp, updated_at: new Date() })
      .eq('user_id', user.user_id);
    if (updateError) {
      console.error('Update OTP error:', updateError);
      if (updateError.message.includes('verification_otp')) {
        return res.status(500).json({ error: 'Database schema error: verification_otp column missing' });
      }
      throw updateError;
    }

    // Delete any existing verification for this email
    const { error: deleteError } = await supabase
      .from('email_verifications')
      .delete()
      .eq('email', email);
    if (deleteError) {
      console.error('Delete existing verification error:', deleteError);
      throw deleteError;
    }

    // Insert new verification
    const { error: insertError } = await supabase
      .from('email_verifications')
      .insert({
        email,
        otp: verification_otp,
        created_at: new Date()
      });
    if (insertError) {
      console.error('Insert OTP error:', insertError);
      throw insertError;
    }

    // Send verification email
    await sendVerificationEmail(email, verification_otp);
    res.json({ message: 'Verification code resent' });
  } catch (err) {
    console.error('Resend verification error:', err);
    next(err);
  }
};

module.exports = { signup, verifyEmail, login, resendVerification };