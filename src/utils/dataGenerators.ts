export function getCountryFromPath(path: string): string {
    const normalized = path.toLowerCase();

    if (normalized.startsWith('/en-us')) return 'US';
    if (normalized.startsWith('/en-ca') || normalized.startsWith('/fr-ca')) return 'CA';
    if (normalized.startsWith('/en-in')) return 'IN';

    return 'IN';
}
export function generateUniquePhoneNumberByCountry(country: string): string {
    const formattedCountry = country && typeof country === 'string' ? country.toUpperCase() : '';

    const areaCodes: Record<string, string[]> = {
        US: ['212', '415', '305'],
        CA: ['416', '647', '514']
    };

    if (formattedCountry === 'IN') {
        const prefix = ['7', '8', '9'][Math.floor(Math.random() * 3)];
        const remainingDigits = Math.floor(100000000 + Math.random() * 900000000).toString();
        return `${prefix}${remainingDigits}`;
    }

    const defaultAreaCode = '999';
    const areaCode = areaCodes[formattedCountry]
        ? areaCodes[formattedCountry][Math.floor(Math.random() * areaCodes[formattedCountry].length)]
        : defaultAreaCode;

    const lineNumber = Math.floor(1000000 + Math.random() * 9000000).toString();
    return `${areaCode}${lineNumber}`;
}
export function generateFirstNameByCountry(country: string): string {
    const countryFirstNames: Record<string, string[]> = {
        IN: [
            'Srinath',
            'Veeramaheswaran',
            'DineshKumar',
            'Dinesh',
            'Arun',
            'Harini',
            'BoothaGanesh',
            'SivaSankar',
            'GopiKrishnan',
            'Saravanan',
            'Lalitha'
        ],
        US: ['John', 'Emily', 'Michael', 'Sarah', 'David', 'Ashley', 'James', 'Emma', 'Ethan', 'Grace', 'Daniel'],
        CA: ['Liam', 'Olivia', 'Noah', 'Charlotte', 'Benjamin', 'Ava', 'Lucas', 'Sophie', 'Mason', 'Amelia', 'Jacob']
    };

    const names = countryFirstNames[country] || ['Alex', 'Jordan', 'Taylor', 'Morgan'];
    return names[Math.floor(Math.random() * names.length)];
}
export function generateLastNameByCountry(country: string, firstName: string): string {
    const countryLastNames: Record<string, string[]> = {
        IN: [
            'Natarajan',
            'Rajagopal',
            'Appasamy',
            'Jayabal',
            'Muniyappan',
            'Thangavel',
            'Marimuthu',
            'Jayavel',
            'Seshadri',
            'Sambandam',
            'Srilakshmi'
        ],
        US: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Anderson', 'Clark', 'Taylor'],
        CA: ['Martin', 'Roy', 'Wilson', 'Lavoie', 'Gagnon', 'Campbell', 'Thompson', 'Leblanc', 'Fortin', 'Lambert', 'Bouchard']
    };

    if (country === 'IN' && firstName) {
        const firstNames = [
            'Srinath',
            'Veeramaheswaran',
            'DineshKumar',
            'Dinesh',
            'Arun',
            'Harini',
            'BoothaGanesh',
            'SivaSankar',
            'GopiKrishnan',
            'Saravanan',
            'Lalitha'
        ];
        const index = firstNames.indexOf(firstName);
        if (index !== -1) {
            return countryLastNames['IN'][index];
        }
    }

    const names = countryLastNames[country] || ['Taylor', 'Anderson', 'Clark', 'Morgan'];
    return names[Math.floor(Math.random() * names.length)];
}
export function generateEmailByCountry(country: string, firstName: string, lastName: string): string {
    const countryEmails: Record<string, string[]> = {
        IN: ['gmail.com', 'yahoo.in', 'outlook.in', 'rediffmail.com', 'hotmail.in', 'zoho.in', 'protonmail.com'],
        US: ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'aol.com', 'icloud.com', 'zoho.com', 'protonmail.com', 'mail.com'],
        CA: [
            'gmail.com',
            'yahoo.ca',
            'outlook.com',
            'hotmail.ca',
            'icloud.com',
            'bell.net',
            'videotron.ca',
            'rogers.com',
            'shaw.ca',
            'protonmail.com',
            'mail.com',
            'zoho.com'
        ]
    };

    const domains = countryEmails[country] || ['example.com'];
    const domain = domains[Math.floor(Math.random() * domains.length)];

    const shortUniqueId = `${Date.now().toString().slice(-5)}`;
    const lastInitial = lastName.replace(/test/i, '')[0]?.toLowerCase() || 'x';
    const localPart = `${firstName.toLowerCase()}.${lastInitial}${shortUniqueId}test`;
    return `${localPart}@${domain}`;
}
export function generatePinCodeByCountry(country: string): string {
    const countryPins: Record<string, string[]> = {
        IN: [
            // Indian PIN codes from major cities
            '110001', // New Delhi
            '400001', // Mumbai
            '600001', // Chennai
            '682001', // Kochi
            '411001', // Pune
            '700001', // Kolkata
            '500001', // Hyderabad
            '560001', // Bangalore
            '380001', // Ahmedabad
            '201001' // Noida
        ],
        US: [
            // US ZIP codes from major cities and states
            '10001', // New York, NY
            '90210', // Beverly Hills, CA
            '30301', // Atlanta, GA
            '60601', // Chicago, IL
            '94105', // San Francisco, CA
            '33101', // Miami, FL
            '80202', // Denver, CO
            '98101', // Seattle, WA
            '20001' // Washington, DC
        ],
        CA: [
            // Canadian postal codes from major cities (format: ANA NAN)
            'M5H 2N2', // Toronto, ON
            'H2Y 1C6', // Montreal, QC
            'T2P 1J9', // Calgary, AB
            'B3J 3K9', // Halifax, NS
            'R3C 4T3', // Winnipeg, MB
            'S7K 0J5', // Saskatoon, SK
            'E3B 1Z1', // Fredericton, NB
            'P3E 5P9', // Sudbury, ON
            'X1A 2P7' // Whitehorse, YT
        ]
    };

    const pins = countryPins[country?.toUpperCase()] ?? countryPins['IN'];
    return pins[Math.floor(Math.random() * pins.length)];
}
export function getOtp(): string {
    const otp = process.env.OTP;

    if (otp && /^\d{5}$/.test(otp)) {
        return otp;
    }
    return '11111';
}
export function getOtpAfterOrder(): string {
    const otp = process.env.OTP_AFTER_ORDER;

    if (otp && /^\d{5}$/.test(otp)) {
        return otp;
    }
    return '10101';
}
export function getEmployeeId(): string {
    const empId = process.env.EMP_ID;
    if (empId && /^\d{5}$/.test(empId)) {
        return empId;
    }
    return '03207';
}
export function getTaxRateByPinCode(pinCode: string): number {
    const pinCodeTaxRates: Record<string, number> = {
        // India PINs (all 18% GST)
        '110001': 0.18,
        '400001': 0.18,
        '600001': 0.18,
        '682001': 0.18,
        '411001': 0.18,
        '700001': 0.18,
        '500001': 0.18,
        '560001': 0.18,
        '380001': 0.18,
        '201001': 0.18,

        // US ZIPs
        '10001': 0.08875, // New York, NY (8.875%)
        '90210': 0.105, // Beverly Hills, CA (10.5%)
        '30301': 0.089, // Atlanta, GA (8.9%)
        '60601': 0.1025, // Chicago, IL (10.25%)
        '94105': 0.08625, // San Francisco, CA (8.625%)
        '33101': 0.07, // Miami, FL (7%)
        '80202': 0.0915, // Denver, CO (9.15%)
        '98101': 0.1035, // Seattle, WA (10.35%)
        '20001': 0.06, // Washington, DC (6%)

        // Canada postal codes
        'M5H 2N2': 0.13, // Toronto, ON (13% HST)
        'H2Y 1C6': 0.14975, // Montreal, QC (14.975% GST + QST)
        'T2P 1J9': 0.05, // Calgary, AB (5% GST only)
        'B3J 3K9': 0.14, // Halifax, NS (14% HST)
        'R3C 4T3': 0.12, // Winnipeg, MB (12% GST + PST)
        'S7K 0J5': 0.11, // Saskatoon, SK (11% GST + PST)
        'E3B 1Z1': 0.15, // Fredericton, NB (15% HST)
        'P3E 5P9': 0.13, // Sudbury, ON (13% HST)
        'X1A 2P7': 0.05 // Whitehorse, YT (5% GST only)
    };

    return pinCodeTaxRates[pinCode] ?? 0;
}
