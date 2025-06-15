const bcrypt = require('bcryptjs');
const supabase = require('../config/db');
const { generateToken } = require('../utils/jwt');
const { sendVerificationEmail } = require('../utils/email');
const { validateSignup, validateLogin } = require('../utils/validators');

const signup = async (req, res, next) => {
  try {
    const { error: validationError } = validateSignup(req.body);
    if (validationError) return res.status(400).json({ error: validationError.details[0].message });

    const { username, email, phone_number, password, role } = req.body;
    if (!role || !['client', 'professional'].includes(role)) {
      return res.status(400).json({ error: 'Role must be either "client" or "professional"' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const verification_otp = Math.floor(100000 + Math.random() * 900000).toString();

    const { data, error: insertError } = await supabase
      .from('users')
      .insert({
        username,
        email,
        phone_number,
        password_hash,
        role,
        verification_otp,
        is_verified: false,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .select();

    if (insertError) throw insertError;

    await sendVerificationEmail(email, verification_otp);
    res.status(201).json({ message: `${role.charAt(0).toUpperCase() + role.slice(1)} registered. Verify your email.` });
  } catch (err) {
    next(err);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { otp } = req.body;
    if (!otp) return res.status(400).json({ error: 'OTP is required' });

    const { data, error: updateError } = await supabase
      .from('users')
      .update({ is_verified: true, verification_otp: null, updated_at: new Date() })
      .eq('verification_otp', otp)
      .eq('is_verified', false)
      .select('user_id, role');

    if (updateError || !data.length) return res.status(400).json({ error: 'Invalid OTP' });

    const user = data[0];
    const token = generateToken({ user_id: user.user_id, role: user.role });
    res.json({ message: 'Email verified successfully', token });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { error: validationError } = validateLogin(req.body);
    if (validationError) return res.status(400).json({ error: validationError.details[0].message });

    const { email, password } = req.body;
    console.log('Attempting login for email:', email);
    const { data, error: queryError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('is_verified', true);

    if (queryError) {
      console.error('Supabase query error:', queryError.message);
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    if (!data || data.length === 0) {
      console.log('No user found for email:', email);
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const user = data[0];
    console.log('User found:', user);
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      console.log('Password mismatch for email:', email);
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = generateToken({ user_id: user.user_id, role: user.role });
    res.json({ token, redirect: '/verify-id' }); // Revert to original response
  } catch (err) {
    next(err);
  }
};

module.exports = { signup, verifyEmail, login };