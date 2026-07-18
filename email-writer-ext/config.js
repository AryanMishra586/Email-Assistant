const LOCAL_API = "http://localhost:8080";
const PROD_API = "https://email-assistant-774b.onrender.com";

async function getApiUrl() {
    try {
        const response = await fetch(`${LOCAL_API}/actuator/health`, {
            method: "GET",
            signal: AbortSignal.timeout(1000)
        });

        if (response.ok) {
            return LOCAL_API;
        }
    } catch (e) {
        console.log("⚠️ Local backend unavailable. Falling back to production.");
    }

    return PROD_API;
}

export default getApiUrl;