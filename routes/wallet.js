const express = require('express');
const router = express.Router();
const lightwallet = require("eth-lightwallet");
const fs = require('fs');

// TODO : lightwallet 모듈을 사용하여 랜덤한 니모닉 코드를 얻습니다.
router.post('/newMnemonic', async (req, res) => {
    let mnemonic;
    try {
        mnemonic = lightwallet.keystore.generateRandomSeed();
        res.json({mnemonic});
    } catch (err) {
        console.log(err);
    }
});


// TODO : 니모닉 코드와 패스워드를 이용해 keystore와 address를 생성합니다.
router.post('/newWallet', async (req, res) => {
    let password = req.body.password
    let mnemonic = req.body.mnemonic;

    try {
        lightwallet.keystore.createVault(
            {
                password: password,
                seedPhrase: mnemonic,
                hdPathString: "m/0'/0'/0'"
            },
            function (err, ks) {
                ks.keyFromPassword(password, function (err, pwDerivedKey) {
                    ks.generateNewAddress(pwDerivedKey, 1);
                    let address = (ks.getAddresses()).toString();
                    let keystore = ks.serialize();
                    fs.writeFile('wallet.json', keystore, function (err, data) {
                        if (err) {
                            res.json({code: 999, message: "실패"});
                            console.log(address)
                        } else {
                            res.json({code: 1, message: "성공", address: address, keystore: keystore});
                        }
                    });
                });
            }
        );
    } catch (exception) {
        console.log("NewWallet ==>>>> " + exception);
    }
});

module.exports = router;