//dev
const crmConfig = {
    crmUrlApi: "https://pr6.crm.com/self-service/v1/",
     crmServer: "https://pr6.crm.com",
    //crmUrlApi: "https://loyaltyuat.hellenicbank.com/self-service/v1/",
    //crmServer: "https://loyaltyuat.hellenicbank.com",  
    //sslCertificates: ["pr6","hellenicbankcom","hellenic_prod"],
    crmApiKey: '3a778bbd-e54b-4542-901c-a48da26fdb53',
    expireToken: 5,
    businessCard: ['456749','456763','456764','456765','513357','513359','542434'],

    enableSSL: true,
    sslPinningOptions: { //SSL Pinning
        sslPinning: { 
            certs: [
                "sha256/dGvzYx8twsmB04SlHFTtfFEJDQjRg/G6uecCS7cAsaM=" //public key *.crm.com,
                ,"sha256/kWM0BgBW5z+P4XA8X/E7V0j/k/btrtQTkd1DxY0CLA0=" //public www.mple.com.cy
                ,"sha256/0/mr4wkoCNljY+EWkb2eMHOTsg1itgjJN3l/WsmZDIc=" //public loyaltyuat.hellenicbank.com
            ],
            // certs: ["pr6","crm","hellenicbankcom","hellenic_prod","hellenicuat"], //certificate
        },
        pkPinning: true,
        timeoutInterval: 300000
    },
}
// production
// const crmConfig = {
//     crmUrlApi: "https://www.mple.com.cy/self-service/v1/",
//     crmServer: "https://www.mple.com.cy",  
//     //sslCertificates: ["pr6","hellenicbankcom","hellenic_prod","hellenic_prod_160321"],
//     crmApiKey: '3a778bbd-e54b-4542-901c-a48da26fdb53',
//     expireToken: 5,
//     businessCard: ['456749','456763','456764','456765','513357','513359','542434'],

//     enableSSL: true,
//     sslPinningOptions: { //SSL Pinning
//     sslPinning: { 
//         certs: [
//             "sha256/dGvzYx8twsmB04SlHFTtfFEJDQjRg/G6uecCS7cAsaM=" //public key *.crm.com,
//             ,"sha256/kWM0BgBW5z+P4XA8X/E7V0j/k/btrtQTkd1DxY0CLA0=" //public www.mple.com.cy
//         ],
//     },
//     pkPinning: true,
//     timeoutInterval: 300000
//     },
// }   

module.exports = {
    crmConfig
};