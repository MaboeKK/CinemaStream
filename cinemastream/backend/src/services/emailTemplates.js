// Shared builder for every transactional (OTP-style) email -- signup
// verification, OTP resend, and password reset previously each carried
// their own copy-pasted <div> markup (see auth.service.js history), styled
// with a flat rgb(106,0,0) badge that predates the app's current brand.
// This centralizes the actual HTML/CSS once so the three call sites just
// supply copy.
//
// Email HTML has much narrower CSS support than the app itself: no
// backdrop-filter, no background-clip:text (so the gradient wordmark
// becomes a solid accent color here), unreliable custom web fonts, and
// Outlook's desktop engine (Word) ignores border-radius and modern
// shorthand entirely. Colors below are hand-copied from
// frontend/src/index.css's :root block rather than shared -- the two
// can't import from each other, so if the brand palette changes there,
// change it here too.
const COLOR_BG = '#0a0710';
const COLOR_CARD = '#161d29';
const COLOR_BORDER = '#2e3648';
const COLOR_TEXT = '#f5f5f5';
const COLOR_TEXT_MUTED = '#b7bcc9';
const COLOR_ACCENT = '#f453a6';
const FONT_STACK =
  "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

const escapeHtml = (str) =>
  String(str).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
  );

/**
 * @param {object} opts
 * @param {string} opts.preheader - hidden inbox-preview snippet
 * @param {string} opts.heading - main heading, e.g. "Verify your email"
 * @param {string} opts.introHtml - intro paragraph(s), already-safe HTML (caller escapes any interpolated values)
 * @param {string} opts.code - the OTP/reset code to display
 * @param {number} [opts.expiryMinutes] - shown in the note under the code
 */
const buildOtpEmailHtml = ({ preheader, heading, introHtml, code, expiryMinutes = 3 }) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="color-scheme" content="dark" />
    <title>${escapeHtml(heading)}</title>
    <!--[if mso]>
    <noscript>
      <xml>
        <o:OfficeDocumentSettings>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
    </noscript>
    <style>table { border-collapse: collapse; }</style>
    <![endif]-->
  </head>
  <body
    style="margin:0;padding:0;background-color:${COLOR_BG};font-family:${FONT_STACK};"
  >
    <!-- Hidden preview text -- keeps the inbox snippet on-message instead of
         falling back to the first visible line of markup. -->
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
      ${escapeHtml(preheader)}
      ${'&nbsp;&zwnj;'.repeat(40)}
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLOR_BG};">
      <tr>
        <td align="center" style="padding:40px 16px;">
          <table
            role="presentation"
            width="100%"
            cellpadding="0"
            cellspacing="0"
            style="max-width:480px;background-color:${COLOR_CARD};border:1px solid ${COLOR_BORDER};border-radius:16px;overflow:hidden;"
          >
            <tr>
              <td style="padding:32px 36px 8px;text-align:center;">
                <span style="font-size:22px;font-weight:800;letter-spacing:-0.02em;">
                  <span style="color:${COLOR_ACCENT};">Cinema</span><span style="color:${COLOR_TEXT};">Stream</span>
                </span>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 36px 0;text-align:center;">
                <h1 style="margin:0;font-size:20px;line-height:1.3;color:${COLOR_TEXT};font-weight:700;">
                  ${escapeHtml(heading)}
                </h1>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 36px 0;color:${COLOR_TEXT_MUTED};font-size:15px;line-height:1.6;text-align:center;">
                ${introHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:28px 36px 4px;text-align:center;">
                <!-- Solid background-color first, gradient declared after as a
                     progressive enhancement -- clients that don't understand
                     the linear-gradient() background value keep the solid
                     color instead of falling back to no background at all. -->
                <span
                  style="display:inline-block;padding:14px 28px;border-radius:10px;background-color:${COLOR_ACCENT};background:linear-gradient(90deg,#ff8a3d 0%,#f453a6 50%,#8b5cf6 100%);font-size:30px;font-weight:800;letter-spacing:8px;color:#ffffff;"
                >
                  ${escapeHtml(code)}
                </span>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 36px 0;text-align:center;color:${COLOR_TEXT_MUTED};font-size:13px;">
                This code expires in ${expiryMinutes} minute${expiryMinutes === 1 ? '' : 's'}.
              </td>
            </tr>
            <tr>
              <td style="padding:28px 36px 32px;text-align:center;color:${COLOR_TEXT_MUTED};font-size:13px;line-height:1.6;border-top:1px solid ${COLOR_BORDER};">
                <p style="margin:20px 0 0;">
                  Didn't request this? You can safely ignore this email.
                </p>
                <p style="margin:16px 0 0;color:#6b7280;">&copy; CinemaStream</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

module.exports = { buildOtpEmailHtml, escapeHtml };
