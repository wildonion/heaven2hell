



## setup 

```bash
docker cp run.sql postgres:run.sql
docker exec -it postgres psql -U postgres -d heaven2hell /run.sql
sudo chmod +x deploy.sh && ./deploy.sh
```

## api call

> endpoints:

GET - https://api.heaven2hell.io/items/?from_idx=0&to_idx=20 ---> get heaven2hell

GET - https://api.heaven2hell.io/get-rarities ----> retrieve bejoe rarities json file

GET - https://api.heaven2hell.io/get-rarity/6Rmv7jM65UwAS3ryBmVWzeHpveu5LT7pTcxpz212Cfd8 ----> retrieve the rarities and ranking of an nft

POST - https://api.node.heaven2hell.io/send-hell ----> heavennfts validation

> request body:

```js
{
    "owner": "5ZWFowCurhLVbryzs7J4S9sdSi8kgBJX5CmbbmV4mKQk",
    "heavennfts": ["AdbvD62q6JuLVFRFs6Up5YMEqkqpJedsEduH41kUgsin", 
            "9X8Qxf4BY7JKZDoJC1hJoKQB41op3KBVzkgps7SSoGec", 
            "EBJQysBdLLdpdcaonUr3Te73tsrQyJKX8LHRR4oLLW5h"], 
    "sent_tx_hashes": [
        "5eUcNej2PSUxXb4UHxrnBn6LaamJ6vyNCM2sFUhqnEjpFDSjCJmHFRyUu3S6DJXbTQbCg9sHnqPJbpAfFYmWNaYD", "2w4DLbcSkmp51ZpULhUkPFbPQBz7cMb6Dm1YVhwdUr2zC9c9gHHUVWRr6RYaTApWBQWdhyPkpRtD3tJgYE6Y7DjU"]
}
```
