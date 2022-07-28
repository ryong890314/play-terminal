import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {

  const webSocketUrl = 'wss://api.upbit.com/websocket/v1';
  const ws = useRef(null);

  const [socketConnected, setSocketConnected] = useState(false);
  const [items, setItems] = useState([
    {"code": "KRW-BTC"},
    {"code": "KRW-ETH"},
    {"code": "KRW-ETC"},
    {"code": "KRW-BCH"},
    {"code": "KRW-BTG"},
    {"code": "KRW-ADA"},
    {"code": "KRW-XRP"},
    {"code": "KRW-EOS"},
    {"code": "KRW-DOGE"},
    {"code": "KRW-STMX"},
    {"code": "KRW-BTT"},
  ]);

  const __onClose = () => {
    ws.current.close();
  }

  useEffect(() => {

    if (!ws.current) {
      ws.current = new WebSocket(webSocketUrl);
      ws.current.binaryType = 'arraybuffer';
      ws.current.onopen = () => {
        console.log("connected to " + webSocketUrl);
        var msg = [
          {
            "ticket": "TEST",
          },
          {
            "type": "ticker",
            "codes": [
              "KRW-BTC",
              "KRW-ETH",
              "KRW-ETC",
              "KRW-BCH",
              "KRW-BTG",
              "KRW-ADA",
              "KRW-XRP",
              "KRW-EOS",
              "KRW-DOGE",
              "KRW-STMX",
              "KRW-BTT",
            ]
          }
        ];
        ws.current.send(JSON.stringify(msg));
        setSocketConnected(true);
      };
      ws.current.onclose = (error) => {
        console.log("disconnect from " + webSocketUrl);
        setSocketConnected(false);
      };
      ws.current.onerror = (error) => {
        console.log("connection error " + webSocketUrl);
        console.log(error);
      };
      ws.current.onmessage = (evt) => {

        const enc = new TextDecoder("utf-8");
        const arr = new Uint8Array(evt.data);
        const data = JSON.parse(enc.decode(arr));

        setItems(prevState => {
          var tem = new Array(prevState.length);;
          for(var i = 0; i < prevState.length; i++) {
            if(prevState[i].code === data.code) {
              tem[i] = data;
            } else {
              tem[i] = prevState[i];
            }
          }
          return tem;
        });

      };
    }
    return () => {
      console.log("clean up");
      ws.current.close();
    };

  }, []);

  return (
    <div className={"container"}>
      
      <div className={"menu-bar"}>
        {socketConnected ? (
          <div className={"menu-button"} onClick={__onClose}>{"[ Stop ]"}</div>
        ) : (
          <div className={"menu-button"}>{"[ Start ]"}</div>
        )}
        <div className={"menu-button"}>{"[ Setting ]"}</div>
      </div>

      <div className={"theme-container"}>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Change</th>
              <th>Volume</th>
            </tr>
          </thead>
          <tbody>

            {items.map(item => (
              <tr key={item.code}>
                <td>{item.code}</td>
                <td>
                  {item.trade_price?.toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 4
                  })}
                </td>
                <td>
                  {(item.signed_change_rate * 100)?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }) + "%"}
                </td>
                <td>
                  {(item.acc_trade_price_24h / 1000000)?.toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  }) + "M"}
                </td>
              </tr>
            ))}

          </tbody>
        </table>
      </div>

    </div>
  );
}

export default App;
