import { configureStore } from '@reduxjs/toolkit'

import language from './language';
import configuration from './configuration';
import profile from './profile';
import merchants from './merchants';
import wallets from './wallets';
import offers from './offers';
import notifications from './notifications';
import cards from './cards';
import accounts from './accounts';
import purchases from './transactions';

export const store = configureStore({
    reducer: {
        language,
        configuration,
        profile,
        merchants,
        wallets,
        offers,
        notifications,
        cards,
        accounts,
        purchases
    }
})