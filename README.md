PolyTools Backend
-----------------

This is the first version of the PolyTools backend. All the information is obtained from MATIC network, using BitQuery GraphQL.

At the moment, it has the following functionality:

1. Token Info: retrieves the information of the token address specified in :token using WMATIC as quote currency.

ENDPOINT: /tokenInfo/:token

2. Last Trades: retrieves the last 5 QuickSwap trades of the token address specified in :token

ENDPOINT: /lastTrades/:token

3. OHLC Data: retrieves OHLC data from QuickSwap.

ENDPOINT: /ohlc

QUERY PARAMS:

* base: address of the token.
* quote: address of the quote currency.
* since: from date.
* until: till date.
* window: 1 / 5 / 15 / 30 / 60 / 240 / 1440 / 10080
* limit: number of trades we want.