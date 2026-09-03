const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Mock Database / State for Members & Affiliates
const membersDB = new Map();

// Endpoint to register/simulate subscription signup ($29.99/mo)
app.post('/api/subscribe', (req, res) => {
    const { name, email, phone } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required.' });

    const memberId = 'FR2P-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const affiliateLink = `https://tceholdings.org/fuel/ref?code=${memberId}`;
    
    const newMember = {
        memberId,
        name: name || 'Valued Member',
        email,
        phone: phone || '',
        tier: 'Standard Fuel Member ($29.99/mo)',
        status: 'Active',
        joinedDate: new Date().toISOString(),
        affiliateLink,
        qrCodeApiUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(affiliateLink)}`
    };

    membersDB.set(memberId, newMember);
    res.json({ success: true, message: 'Successfully enrolled in The FR2P Club Fuel Program!', data: newMember });
});

// Endpoint to fetch member back-office profile by ID
app.get('/api/member/:id', (req, res) => {
    const member = membersDB.get(req.params.id);
    if (!member) {
        // Return a mock fallback if testing directly
        return res.json({
            memberId: req.params.id,
            name: 'Derrick Taylor',
            tier: 'Standard Fuel Member ($29.99/mo)',
            affiliateLink: `https://tceholdings.org/fuel/ref?code=${req.params.id}`,
            qrCodeApiUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://tceholdings.org/fuel/ref?code=${req.params.id}`
        });
    }
    res.json(member);
});

app.listen(PORT, () => {
    console.log(`TCE Fuel Perks Sub-Brand running on port ${PORT}`);
});
