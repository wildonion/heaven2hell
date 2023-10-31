
const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors')
var bejoe_rarities = require('../raritiees.json');
const { Pool } = require('pg');
const { useConnection, useWallet} = require('@solana/wallet-adapter-wallets');
const { getParsedNftAccountsByOwner } = require('@nfteyez/sol-rayz');
const { Connection, Keypair, PublicKey, clusterApiUrl, Transaction  } = require('@solana/web3.js');
const { Metaplex,walletAdapterIdentity} = require("@metaplex-foundation/js");
const { bs58 } = require("@project-serum/anchor/dist/cjs/utils/bytes");
const { Metadata } = require("@metaplex-foundation/mpl-token-metadata");
const { web3 } = require('@project-serum/anchor');


const app = express();
const port = 3535;



// PostgreSQL setup
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'heaven2hell',
    password: '',
    port: 5432,
});

let network = "";
const connection = new Connection(network, 'confirmed');

class MyWallet  {

    constructor( payer) {
        this.payer = payer
    }
    
    async signTransaction(tx) {
        tx.partialSign(this.payer);
        return tx;
    }
    
    async signAllTransactions(txs) {
        return txs.map((t) => {
            t.partialSign(this.payer);
            return t;
        });
    }
    
    get publicKey() {
        return this.payer.publicKey;
    }
    }
    
    const serverwallet = Keypair.fromSecretKey(
    bs58.decode(
        ""
    )
    ).publicKey;

    const serverwallet_Keypair= Keypair.fromSecretKey(
    bs58.decode(
        ""
    )
    )
    
const wallet2 = new MyWallet(serverwallet_Keypair)

const metaplex = Metaplex.make(connection)
.use(walletAdapterIdentity(wallet2))

const receiverPubkey = new PublicKey ('')


app.use(bodyParser.json());
app.use(cors())

app.post('/send-hell', async (req, res) => {
    const { owner, heavennfts, sent_tx_hashes } = req.body;


    nfts = bejoe_rarities.result.data.items
    let allusernftsranks = [];
    
    heavennfts.forEach(mint => {
        const item = nfts.find(item => item.mint === mint);
        if (item) {
            allusernftsranks.push(item.rank);
        }
    });
    
    const totalRank = allusernftsranks.reduce((acc, rank) => acc + rank, 0);

    let points;
    if (totalRank >= 1 && totalRank <= 1000) {
        points = 5;
    } else if (totalRank >= 1001 && totalRank <= 2000) {
        points = 4.5;
    } else if (totalRank >= 2001 && totalRank <= 3000) {
        points = 4;
    } else if (totalRank >= 3001 && totalRank <= 4000) {
        points = 3.5;
    } else if (totalRank >= 4001 && totalRank <= 5000) {
        points = 3;
    } else {
        points = 0; // Assign 0 or any other default value for ranks outside the specified range
    }

    if (points < 100){
        
        return res.status(406).send({ error: "Points Are Not Enough" });
        
    }


    let converted_at;
    let hell;

    const client = await pool.connect();
    // Check if the owner's sent_tx_hashes already exists in the DB
    const result = await client.query('SELECT sent_tx_hashes FROM heavennfts WHERE owner = $1', [owner]);
    const existing_tx_hashes = result.rows[0]?.sent_tx_hashes || [];

    // If there's no overlap between existing and incoming tx hashes, perform the update/insert
    if (existing_tx_hashes.some(tx => sent_tx_hashes.includes(tx))) {
        res.status(302).send({ error: 'Already converted' });
    } else{

        let transactiondetails = []
        let usernftSent = []
        let hash_sender_wallet
        let received_wallet

        for(i = 0; i < sent_tx_hashes.length; i++){
            // const hash = "5bfUbXJLgspJkq4q2kZbndm5FX96nPoefprKizkBQTKQmPt5zieUyam9LDckxxkGPXA9knxAr6Rvb5pKXzBV9UWc"
            const hash = sent_tx_hashes[i];
            

            const getnftcreator = async (mint) => {
                let nft = await metaplex.nfts().findByMint({mintAddress: mint})
                return (
                nft.creators[0].address.toString())
            }
        
            transactiondetails[i] = await connection.getParsedTransactions([hash])
            // console.log("hash details: ", transactiondetails[i])
             
             for (let j=0; j< transactiondetails[i][0].meta.innerInstructions.length; j++) {
               if(transactiondetails[i][0].transaction.message.accountKeys[0].signer == true &&
                 await getnftcreator( new PublicKey ( transactiondetails[i][0].meta.innerInstructions[j].instructions[0].parsed.info.mint)) == '')
                    { usernftSent.push(transactiondetails[i][0].meta.innerInstructions[j].instructions[0].parsed.info.mint)
                     hash_sender_wallet = transactiondetails[i][0].transaction.message.accountKeys[0].pubkey.toString()
                   }
       
                    if (transactiondetails[i][0].meta.postTokenBalances[j].owner != hash_sender_wallet) {
                     received_wallet = transactiondetails[i][0].meta.postTokenBalances[j].owner
                   }
             }

            console.log("Real BeJoe Sender wallet: ", hash_sender_wallet)
            console.log("usernft sent numbers ", usernftSent.length)
            console.log("usernft Mints Sent: ", usernftSent)
            console.log("Hash: ", hash )
            console.log("Received wallet: ", received_wallet)
    
            
        }
        
        // is tx hash valid
        const foundjoe = usernftSent.some(r=> heavennfts.includes(r))
        if (receiverPubkey == received_wallet 
            && foundjoe
            && hash_sender_wallet == owner
            ){

                const owner_pubkey = new PublicKey (owner);
    
                const nfts = await getParsedNftAccountsByOwner({
                        publicAddress: serverwallet,
                        connection: connection,
                })
                    
                
                const getIsFromCollection = (nft) => {
                    return (
                        nft.data.creators &&
                        nft.mint &&
                        (nft.data.creators.filter(creator => ((creator.address === '') &&
                        creator.verified &&
                        creator.verified===1)).length > 0) &&
                        nft.data.creators?.filter((x) => x.verified).length > 0
                    )
                }
                const hellnfts = nfts.filter(nft => getIsFromCollection(nft))
                console.log("Server hell: ", hellnfts)
                
        
                let howmanyhell;
                if (points >= 100){
        
                    howmanyhell = Math.floor(points / 100);
                }
        
        
                let selectedNfts = [];
                while (selectedNfts.length < 1) {
                    const randomIndex = Math.floor(Math.random() * hellnfts.length);
                    const mint = hellnfts[randomIndex].mint;
        
                    if (!selectedNfts.includes(mint)) {
                        selectedNfts.push(mint);
                    }
                }
        
                let Tx = new Transaction();
                for (let i=0 ; i < selectedNfts.length ; i++ ) {
        
                    const mint = new PublicKey (selectedNfts[i]) 
                    const nft = await metaplex.nfts().findByMint({mintAddress: mint});
            
                    const txBuilder = metaplex.nfts().builders().transfer({
                        nftOrSft: nft,
                        // fromOwner: publicKey,
                        toOwner: owner_pubkey,
                        // amount: token(1),
                        authority: wallet2,
                    });
        
                    const blockhash = await connection.getLatestBlockhash();
                    const transactions = txBuilder.toTransaction(blockhash);
                    Tx.add(transactions);
        
        
                }
        
        
                const signature = await web3.sendAndConfirmTransaction(connection, Tx, [serverwallet_Keypair]);
        
                    // console.log("Sender wallet: " ,publicKey.toString())
                const transactiondetails_ = await connection.getParsedTransactions([signature])
                console.log("Hahs Details: ", transactiondetails_)
                let hellSent = [];
                let receivedwallet = [];
                for (let i=0; i< transactiondetails_[0].meta.innerInstructions.length; i++) {
                    hellSent.push(transactiondetails_[0].meta.innerInstructions[i].instructions[0].parsed.info.mint)
                    receivedwallet.push (transactiondetails_[0].meta.postTokenBalances[0].owner)
                }
                console.log("hell sent numbers ", hellSent.length)
                console.log("usernft Mints Sent: ", hellSent)
                console.log("hash", signature)
                console.log("hell Receiver:" , receivedwallet )
        
                hell = selectedNfts;
                converted_at = Date.now();
        
                // Store in Postgres
                try {
                    await storeindb({ owner, points, heavennfts, sent_tx_hashes, hell, converted_at });
                    return res.send({ owner, heavennfts, points, sent_tx_hashes, hell, converted_at });
                } catch (error) {
                    console.error(error);
                    return res.status(500).send({ error: error });
                }
                
            } else{
                return res.status(406).send({ error: 'Invalid usernft or Joe Owner' });
            }

    
    }
    
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

async function storeindb(data) {
    const client = await pool.connect();
    try {
        console.log("data to be stored: ", data);
        await client.query('INSERT INTO heavennfts(owner, points, heavennfts, sent_tx_hashes, hell, converted_at) VALUES($1, $2, $3::TEXT[], $4::TEXT[], $5::TEXT[], $6)', 
                           [data.owner, data.points, data.heavennfts, data.sent_tx_hashes, data.hell, data.converted_at]);
    } finally {
        client.release();
    }
}





