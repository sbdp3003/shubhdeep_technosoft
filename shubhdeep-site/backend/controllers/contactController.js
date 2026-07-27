import Contact from '../models/Contact.js';
import sendEmail from '../utils/sendEmail.js';

export const submitContact = async (req, res, next) => {
  try {
    const { fullName, email, phone, service, message } = req.body;

    if (!fullName || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email and message are required.' });
    }

    const contact = await Contact.create({ fullName, email, phone, service, message });

    const notifyTo = process.env.NOTIFY_EMAIL || process.env.SMTP_USER;
    const emailSent = await sendEmail({
      to: notifyTo,
      replyTo: email,
      subject: `New contact form submission — ${fullName}`,
      html: `
        <div style="font-family:sans-serif; max-width:520px;">
          <h2 style="color:#2563EB;">New Website Enquiry</h2>
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || '—'}</p>
          <p><strong>Service:</strong> ${service || '—'}</p>
          <p><strong>Message:</strong></p>
          <p style="background:#F8FAFC; padding:14px; border-radius:8px; white-space:pre-wrap;">${message}</p>
          <p style="color:#94A3B8; font-size:12px; margin-top:20px;">Submitted from shubhdeeptechnosoft.com contact form</p>
        </div>
      `
    });

    if (emailSent) {
      contact.emailSent = true;
      await contact.save();
    }

    res.status(201).json({
      success: true,
      message: "Thanks! We've received your message and will get back to you within one business day."
    });
  } catch (err) {
    next(err);
  }
};

export const getContacts = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const contacts = await Contact.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: contacts.length, data: contacts });
  } catch (err) {
    next(err);
  }
};

export const updateContactStatus = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!contact) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: contact });
  } catch (err) {
    next(err);
  }
};