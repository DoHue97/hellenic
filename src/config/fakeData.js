export var fakeData = {
    wallets: {
        "content": [
            {
                "id": "6A24D2B5E44F44B28451FE021FCAD51E",
                "account_id": "6A24D2B5E44F44B28451FE021FCAD52E",
                "number": "W000001",
                "balance": 1234.56,
                "alternative_balance": 231.54,
                "currency_code": "EUR",
                "alternative_currency_code": "PTS",
                "conditional_balance": 25.34,
                "conditional_alternative_balance": 1.52,
                "unconditional_balance": 4.75,
                "unconditional_alternative_balance": 4.57,
                "amount_on_hold": 5.98,
                "alternative_amount_on_hold": 2.34
            }
        ]
    },
    reward_offers:{
        "content": [
            {
                "id": "6A24D2B5E44F44B28451FE021FCAD51E",
                "name": "10% off on any purchase",
                "description": "Lorem Ipsum",
                "category": {
                    "id": "CAD1E31269B76D7A65ACCE45B2E68DFD",
                    "name": "Seasonal"
                },
                "marketing_information": {
                    "short_description": "Lorem Ipsum",
                    "long_description": "Lorem Ipsum",
                    "terms_and_conditions": "Lorem Ipsum",
                    "creatives": [
                        {
                            "media_type": "Artwork",
                            "width": 2159,
                            "height": 3075,
                            "format": "jpg",
                            "content_url": "https://assets.crm.com/image/offer.jpg",
                            "media": [
                                {
                                    "width": 200,
                                    "height": 300,
                                    "url": "https://asset.crm.com/image/offer/c_scale,w_200/offer.jpg"
                                }
                            ]
                        }
                    ]
                },
                "life_cycle_state": "EFFECTIVE",
                "reward_scheme": {
                    "id": "CAD1E31269B76D7A65ACCE45B2E68DFD",
                    "name": "Loyalty Scheme"
                }
            }
        ],
        "paging": {
            "page": 1,
            "size": 10,
            "sort": {
                "orders": [
                    {
                        "sort": "DESC",
                        "property": "ID",
                        "ignore_case": "true",
                        "null_handling": "MULLS_LAST"
                    }
                ]
            }
        },
        "total": 1
    },
    contact: {
        phone: "99626156",
        card: "4567480011111111"
    }
}