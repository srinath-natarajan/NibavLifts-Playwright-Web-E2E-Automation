export const PaymentOptions = {
    CARD: 'CARDS_OR_NETBANKING',
    CHEQUE_OR_DD: 'CHEQUE_OR_DD',
    CONTACT_SALES: 'CONTACT_SALES'
};

import { Locator } from '@playwright/test';

export type RazorpayOptionKeys = 'CreditCard' | 'DebitCard' | 'NetBanking' | 'AmexCard' | 'InternationalCard';

export type RazorpayOptionsMap = {
    [key in RazorpayOptionKeys]: Locator;
};
