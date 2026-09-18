/**
 * Cloudflare Turnstile Verification Helper
 * Provides server-side validation against Cloudflare's siteverify endpoint.
 *
 * Official Testing Keys for Dev / Sandbox:
 * Site Key:   1x00000000000000000000AA  (Always passes)
 * Secret Key: 1x0000000000000000000000000000000AA (Always passes)
 */

export async function verifyTurnstileToken(token, clientIp = '') {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  // If Turnstile is not configured in this environment, gracefully bypass
  // to avoid breaking local dev or environments where keys are pending.
  if (!secretKey) {
    return { success: true, bypassed: true };
  }

  if (!token) {
    return {
      success: false,
      error: 'Security challenge failed: Turnstile token is required.',
    };
  }

  try {
    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', token);
    if (clientIp) {
      formData.append('remoteip', clientIp);
    }

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!res.ok) {
      console.error(`Turnstile HTTP error ${res.status}`);
      return { success: false, error: 'Could not contact verification service.' };
    }

    const outcome = await res.json();

    if (outcome.success) {
      return { success: true };
    }

    console.warn('Turnstile verification failed:', outcome['error-codes']);
    return {
      success: false,
      error: 'Bot verification failed. Please refresh the page and try again.',
      errorCodes: outcome['error-codes'],
    };
  } catch (error) {
    console.error('Turnstile verification exception:', error);
    // In case of network timeout with Cloudflare, fail safe or report error
    return {
      success: false,
      error: 'Verification service error. Please try again.',
    };
  }
}
