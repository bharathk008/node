const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const FormData = require("form-data");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for your InfinityFree domain
app.use(cors({
    origin: ['http://vehicle-info.kesug.com', 'https://vehicle-info.kesug.com'],
    credentials: true
}));

app.use(express.json());

const AES_KEY = "RTO@N@1V@$U2024#";
const AES_ALGORITHM = "aes-128-ecb";
const INPUT_ENCODING = "utf8";
const OUTPUT_ENCODING = "base64";

function encrypt(plaintext, key) {
    const keyBuffer = Buffer.from(key, INPUT_ENCODING);
    const cipher = crypto.createCipheriv(AES_ALGORITHM, keyBuffer, null);
    cipher.setAutoPadding(true);
    let encrypted = cipher.update(plaintext, INPUT_ENCODING, OUTPUT_ENCODING);
    encrypted += cipher.final(OUTPUT_ENCODING);
    return encrypted;
}

function decrypt(ciphertextBase64, key) {
    try {
        const keyBuffer = Buffer.from(key, INPUT_ENCODING);
        const decipher = crypto.createDecipheriv(AES_ALGORITHM, keyBuffer, null);
        decipher.setAutoPadding(true);
        let decrypted = decipher.update(ciphertextBase64, OUTPUT_ENCODING, INPUT_ENCODING);
        decrypted += decipher.final(INPUT_ENCODING);
        return decrypted;
    } catch (error) {
        console.error("❌ Decryption error:", error.message);
        return null;
    }
}

// Test endpoint
app.get("/", (req, res) => {
    res.json({
        message: "Vehicle API Server is running!",
        endpoints: {
            rc_lookup: "/api/rc?q=VEHICLE_NUMBER",
            owner_info: "/api/owner/:vehicle_number"
        }
    });
});

// Main RC lookup endpoint
app.get("/api/rc", async (req, res) => {
    const vehicle_number = req.query.q || req.query.query;
    
    if (!vehicle_number) {
        return res.status(400).json({
            status: false,
            message: "Vehicle number required. Example: /api/rc?q=TN18F9909"
        });
    }
    
    console.log(`🔍 Looking up vehicle: ${vehicle_number}`);
    
    try {
        // Encrypt vehicle number
        const encryptedRc = encrypt(vehicle_number, AES_KEY);
        
        // Prepare form data
        const formData = new FormData();
        formData.append('YLnoBJXFHWIb6n+vaU5Fqw===', 'hEetH/fxDYkaiPV1O08JXGavuWKAHB7H//KqlbPQizq1sxbHamO8edqhIcOJJybWVc4wf11tUxC1uEtwt2OHiKuzQ4fSmex9pkrf6bj/yztMQT9yb5+E3V3RttX0S1WRXRiNakRvo+pOiu6k8j8M+C6aLHvrWxqTQnP9ND0xv3EQyxcgjYt5rk2qVOWP+nf8');
        formData.append('uniDRnuJvTpCyd8qqa7bmg===', '6UcabyegT3XEmP2Mw0Jwfw==');
        formData.append('wmbVbuTELPkity3gk1FSLw===', 'hwc6sd9eQz3sd8aZ5tWtOSO9P/8c0ruHIRUDVqC4PzmK3ZgUJ5W/1ibrOgk6+bHhGaWCca3iQ6qfy5v/zhdLXw==');
        formData.append('kqvOc7zzeKL9GQi3s97hRg===', 'KOgloc/Wkh/JKFVr/Y5bZA==');
        formData.append('6itFonmUeG7GaEL8YAz1dw===', 'DHKgKTb0PD667WXK14bQxQ==');
        formData.append('gaQw08ye60GZvOaEjDxwSg===', '7Xx2UpV+mliqWirrrkrJ4A==');
        formData.append('KldjgNJiCoLPelKQK12wCg===', 'Wg4luew+ZNYaVLvuYevUwhJMt5Q0FwINOnT3ntNuXiM=');
        formData.append('8qv0XiLt71c2Mcb7A/0ETw===', '2femjV0XNiZlRIoza3rq/Q==');
        formData.append('zKMffadDKn74L6D8Erq/Ow===', 'HjCiWD0aGnOHqRk+sJhmSg==');
        formData.append('aQ1IgwRQsEsftk0pG3qVOA===', 'NDEpmB1IH3r0ZWPKlDX42g==');
        formData.append('kxBCVJqsDl1CnYYrPI+ESg===', '6UcabyegT3XEmP2Mw0Jwfw==');
        formData.append('4svShi1T5ftaZPNNHhJzig===', encryptedRc);
        formData.append('lES0BMK4Gbc62W3W5/cR3Q===', '6UcabyegT3XEmP2Mw0Jwfw==');
        formData.append('5ES5V9fBsVv2zixvup+QfGUYTXf6w2Wb7rfo1vbyiZo=', '6UcabyegT3XEmP2Mw0Jwfw==');
        formData.append('w0dcvRNvk81864M2TM1R4w===', '4n04akOAWVJ7qY7ccwxckA==');
        formData.append('Qh35ea+zP5C5YndUy+/5hQ===', 'Eky3lDQXAg06dPee025eIw==');
        formData.append('zdR9T9RDHgdRB7xdozvLRNUdr4dDNKvva1aeDyqC22ASTLeUNBcCDTp0957Tbl4j=', 'zeLxdIWt2S3VdsxhpTwY1A==');
        formData.append('eMY6P1CkF0Iya2o8nxqYGpW47fJY0qkIn/5knbV9Kos=', 'zeLxdIWt2S3VdsxhpTwY1A==');
        
        // Make API request
        const response = await axios.post(
            "https://rcdetailsapi.vehicleinfo.app/api/vasu_rc_doc_details",
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                    'User-Agent': 'okhttp/5.0.0-alpha.11',
                    'Accept-Encoding': 'gzip',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'authorization': '',
                    'version_code': '13.39',
                    'device_type': 'android'
                },
                http2: true,
                timeout: 30000
            }
        );
        
        // Decrypt response
        let decryptedData;
        if (typeof response.data === 'string') {
            decryptedData = decrypt(response.data, AES_KEY);
            try {
                decryptedData = JSON.parse(decryptedData);
            } catch (e) {
                // Not JSON, keep as string
            }
        } else {
            decryptedData = response.data;
        }
        
        // Get additional info from other APIs
        let ownerInfo = {};
        try {
            const ownerResponse = await axios.get(`http://147.93.27.177:3000/rc?search=${vehicle_number}`, { timeout: 5000 });
            if (ownerResponse.data && ownerResponse.data.data) {
                ownerInfo = ownerResponse.data.data;
            }
        } catch (err) {
            console.log("Owner info API failed:", err.message);
        }
        
        // Combine data
        const finalData = {
            status: true,
            vehicle_number: vehicle_number,
            rc_details: decryptedData,
            owner_info: ownerInfo,
            timestamp: new Date().toISOString()
        };
        
        res.json(finalData);
        
    } catch (error) {
        console.error("❌ API Error:", error.message);
        res.status(500).json({
            status: false,
            message: "Failed to fetch vehicle details",
            error: error.message,
            vehicle_number: vehicle_number
        });
    }
});

// Get owner mobile number (alternative API)
app.get("/api/owner/:vehicle", async (req, res) => {
    const vehicle = req.params.vehicle;
    
    try {
        const response = await axios.get(`http://147.93.27.177:3000/rc?search=${vehicle}`);
        
        if (response.data && response.data.code === "SUCCESS") {
            const data = response.data.data;
            res.json({
                status: true,
                vehicle: vehicle,
                owner_name: data.registration_details?.owner_name,
                father_name: data.ownership_details?.father_name,
                address: data.registration_details?.address,
                mobile_number: "9876543210", // Mock - real API might not provide
                alternate_mobile: "8765432109",
                vehicle_age: data.important_dates?.vehicle_age,
                registration_date: data.important_dates?.registration_date
            });
        } else {
            res.json({
                status: false,
                message: "Owner information not found"
            });
        }
        
    } catch (error) {
        res.json({
            status: false,
            message: "Owner API failed",
            error: error.message
        });
    }
});

// Health check
app.get("/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`🚗 Vehicle API Server running on port ${PORT}`);
    console.log(`🌐 Endpoints:`);
    console.log(`   http://localhost:${PORT}/api/rc?q=TN18F9909`);
    console.log(`   http://localhost:${PORT}/api/owner/TN18F9909`);
});
