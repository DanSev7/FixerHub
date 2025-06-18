// const Tesseract = require('tesseract.js');
// const supabase = require('../config/db');

// const verifyId = async (req, res) => {
//     try {
//         const { image, userId } = req.body;
//         if (!image || !userId) {
//             return res.status(400).json({ message: 'Image and user ID are required' });
//         }

//         // Validate userId as UUID (basic check)
//         if (!/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(userId)) {
//             return res.status(400).json({ message: 'Invalid user ID format' });
//         }

//         // Convert base64 to buffer
//         const base64Data = image.split(',')[1]; // Extract base64 part
//         const buffer = Buffer.from(base64Data, 'base64');

//         const { data: { text } } = await Tesseract.recognize(buffer, 'eng');
//         const words = text
//             .toLowerCase()
//             .replace(/[^\w\s]/g, '')
//             .split(/\s+/)
//             .filter(word => word.length > 0);

//         const { data: users, error } = await supabase
//             .from('users')
//             .select('username')
//             .eq('id', userId);
//         if (error || !users.length) throw new Error('Invalid user ID');

//         const usernames = users.map(user => user.username.toLowerCase());
//         const matchFound = usernames.some(username => words.includes(username));

//         // Dynamically insert into professional_documents on successful verification
//         if (matchFound) {
//             const documentId = crypto.randomUUID(); // Generate unique UUID
//             const nationalIdDocumentUrl = `data:image/jpeg;base64,${base64Data}`; // Placeholder URL
//             const { error: insertError } = await supabase
//                 .from('professional_documents')
//                 .insert({
//                     document_id: documentId,
//                     user_id: userId,
//                     national_id_document_url: nationalIdDocumentUrl,
//                     verification_status: 'verified'
//                 });
//             if (insertError) throw insertError;
//         } else {
//             await supabase
//                 .from('professional_documents')
//                 .upsert(
//                     { user_id: userId, verification_status: 'failed' },
//                     { onConflict: ['user_id'] } // Update if exists
//                 );
//         }

//         res.json({ message: matchFound ? 'Verification Successful' : 'Verification Failed' });
//     } catch (error) {
//         console.error('Error details:', error);
//         res.status(500).json({ message: 'Error processing image' });
//     }
// };

// module.exports = { verifyId };

// const Tesseract = require('tesseract.js');
// const supabase = require('../config/db');

// const verifyId = async (req, res) => {
//   try {
//     const { image } = req.body;
//     const userId = req.user?.user_id; // Use optional chaining to avoid undefined error
//     console.log('User Id:', userId);

//     if (!image || !userId) {
//       return res.status(400).json({ message: 'Image and user ID are required' });
//     }

//     const base64Data = image.split(',')[1];
//     const buffer = Buffer.from(base64Data, 'base64');

//     const { data: { text } } = await Tesseract.recognize(buffer, 'eng');
//     const words = text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(word => word.length > 0);

//     const { data: users, error } = await supabase
//       .from('users')
//       .select('username')
//       .eq('user_id', userId)
//       .single();
//     if (error) throw error;

//     const usernames = [users.username.toLowerCase()];
//     const matchFound = usernames.some(username => words.includes(username));

//     if (matchFound) {
//       const documentId = crypto.randomUUID();
//       const nationalIdDocumentUrl = `data:image/jpeg;base64,${base64Data}`;
//       const { error: insertError } = await supabase
//         .from('professional_documents')
//         .insert({
//           document_id: documentId,
//           user_id: userId,
//           national_id_document_url: nationalIdDocumentUrl,
//           verification_status: 'verified',
//           updated_at: new Date(),
//         });
//       if (insertError) throw insertError;
//     } else {
//       await supabase
//         .from('professional_documents')
//         .upsert({ user_id: userId, verification_status: 'failed', updated_at: new Date() }, { onConflict: ['user_id'] });
//     }

//     res.json({ message: matchFound ? 'Verification Successful' : 'Verification Failed' });
//   } catch (error) {
//     console.error('Error details:', error);
//     res.status(500).json({ message: 'Error processing image' });
//   }
// };

// module.exports = { verifyId };

// const Tesseract = require('tesseract.js');
// const supabase = require('../config/db');

// const verifyId = async (req, res) => {
//   try {
//     const { image } = req.body;
//     const userId = req.user?.user_id; // Use optional chaining to avoid undefined error
//     console.log('User Id:', userId);

//     if (!image || !userId) {
//       return res.status(400).json({ message: 'Image and user ID are required' });
//     }

//     const base64Data = image.split(',')[1];
//     const buffer = Buffer.from(base64Data, 'base64');

//     const { data: { text } } = await Tesseract.recognize(buffer, 'eng');
//     const words = text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(word => word.length > 0);

//     const { data: users, error } = await supabase
//       .from('users')
//       .select('username')
//       .eq('user_id', userId)
//       .single();
//     if (error) throw error;

//     const usernames = [users.username.toLowerCase()];
//     const matchFound = usernames.some(username => words.includes(username));

//     if (matchFound) {
//       const documentId = crypto.randomUUID();
//       const nationalIdDocumentUrl = `data:image/jpeg;base64,${base64Data}`;
//       const { error: insertError } = await supabase
//         .from('professional_documents')
//         .insert({
//           document_id: documentId,
//           user_id: userId,
//           national_id_document_url: nationalIdDocumentUrl,
//           verification_status: 'verified',
//           updated_at: new Date(),
//         });
//       if (insertError) throw insertError;
//     } else {
//       await supabase
//         .from('professional_documents')
//         .upsert({ user_id: userId, verification_status: 'failed', updated_at: new Date() }, { onConflict: ['user_id'] });
//     }

//     res.json({ message: matchFound ? 'Verification Successful' : 'Verification Failed' });
//   } catch (error) {
//     console.error('Error details:', error);
//     res.status(500).json({ message: 'Error processing image' });
//   }
// };

// module.exports = { verifyId };

const Tesseract = require('tesseract.js');
const supabase = require('../config/db');

const verifyId = async (req, res) => {
  try {
    const { image } = req.body;
    const userId = req.user?.user_id;
    console.log('User Id:', userId);

    if (!image || !userId) {
      return res.status(400).json({ message: 'Image and user ID are required' });
    }

    const base64Data = image.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');

    const { data: { text } } = await Tesseract.recognize(buffer, 'eng');
    const words = text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(word => word.length > 0);

    const { data: users, error } = await supabase
      .from('users')
      .select('username')
      .eq('user_id', userId)
      .single();
    if (error) throw error;

    const usernames = [users.username.toLowerCase()];
    const matchFound = usernames.some(username => words.includes(username));

    if (matchFound) {
      const documentId = crypto.randomUUID();
      const nationalIdDocumentUrl = `data:image/jpeg;base64,${base64Data}`;
      const { error: insertError } = await supabase
        .from('professional_documents')
        .insert({
          document_id: documentId,
          user_id: userId,
          national_id_document_url: nationalIdDocumentUrl,
          verification_status: 'verified',
          updated_at: new Date(),
        });
      if (insertError) throw insertError;
    } else {
      await supabase
        .from('professional_documents')
        .upsert({ user_id: userId, verification_status: 'failed', updated_at: new Date() }, { onConflict: ['user_id'] });
    }

    res.json({ message: matchFound ? 'Verification Successful' : 'Verification Failed' });
  } catch (error) {
    console.error('Error details:', error);
    res.status(500).json({ message: 'Error processing image' });
  }
};

// New: Basic job creation endpoint
const createJob = async (req, res) => {
  try {
    const { category_id, location } = req.body;
    const userId = req.user.user_id;

    if (!category_id || !userId) {
      return res.status(400).json({ message: 'Category ID and user ID are required' });
    }

    const { data, error } = await supabase
      .from('professional_jobs')
      .insert({
        user_id: userId,
        category_id,
        location,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .select();

    if (error) throw error;

    res.status(201).json({ message: 'Job created successfully', data });
  } catch (error) {
    console.error('Error details:', error);
    res.status(500).json({ message: 'Error creating job' });
  }
};

module.exports = { verifyId, createJob };