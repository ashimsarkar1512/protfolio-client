const DEV_FALLBACK_SERVER_URL = "http://localhost:5000";

export const getServerUrl = () => {
  const configuredUrl =
    process.env.NEXT_PUBLIC_SERVER_URL || process.env.SERVER_URL;

  if (configuredUrl) {
    return configuredUrl.replace(/\/+$/, "");
  }

  if (process.env.NODE_ENV !== "production") {
    return DEV_FALLBACK_SERVER_URL;
  }

  throw new Error(
    "Missing server URL. Set NEXT_PUBLIC_SERVER_URL or SERVER_URL in environment variables."
  );
};
