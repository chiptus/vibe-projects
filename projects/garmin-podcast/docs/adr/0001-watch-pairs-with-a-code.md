# The watch pairs with a code, not OAuth on the phone

People sign in on the web with Google. A Garmin watch cannot do that, so the watch shows a short Pairing code, the signed-in person types it into the site, and the server gives that watch its own long-lived credential, which it stores itself. We rejected OAuth through Garmin Connect Mobile: it is harder to build and, without the Connect IQ simulator in our environment, harder to test. A watch credential can be revoked per watch without touching the Google account.
