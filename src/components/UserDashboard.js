import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import './UserDashboard.css';
import ChatBox from './ChatBox';
import { useNavigate } from 'react-router-dom'; // ✅ For navigation



const UserDashboard = () => {
    const navigate = useNavigate(); // ✅ useNavigate hook

    const chartContainerRef = useRef();
    const [stocks, setStocks] = useState([]);
    const [selectedStock, setSelectedStock] = useState(null);
    const selectedStockRef = useRef(selectedStock);

    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    const [news, setNews] = useState([]);
    const [showNews, setShowNews] = useState(false);

    const [showChat, setShowChat] = useState(false);


    // ✅ Handle Logout
    const handleLogout = () => {
        localStorage.clear();      // Clear session/localStorage
        navigate('/');             // Redirect to login page
    };


    useEffect(() => {
        selectedStockRef.current = selectedStock;
    }, [selectedStock]);

    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws');
        const stompClient = new Client({
            webSocketFactory: () => socket,
            debug: () => { },
            onConnect: () => {
                stompClient.subscribe('/topic/stocks', (message) => {
                    const updatedStocks = JSON.parse(message.body);
                    setStocks(updatedStocks);

                    // If selectedStock is set, update it too
                    if (selectedStockRef.current) {
                        const updated = updatedStocks.find(
                            s => s.id === selectedStockRef.current.id
                        );
                        if (updated) {
                            setSelectedStock({ ...updated });
                            selectedStockRef.current = { ...updated };
                        }
                    }
                });
            },
            onStompError: (frame) => {
                console.error('Broker error:', frame.headers['message']);
            },
        });
        stompClient.activate();

        return () => stompClient.deactivate();
    }, []);

    useEffect(() => {
        axios.get('http://localhost:8080/stocks/findall')
            .then(res => setStocks(res.data))
            .catch(err => console.error('Error fetching stocks', err));
    }, []);

    useEffect(() => {
        if (!selectedStock) return;

        const chart = createChart(chartContainerRef.current, {
            width: 900,
            height: 450,
            layout: { background: { color: '#1e1e2f' }, textColor: '#D9D9D9' },
            grid: { vertLines: { color: '#444' }, horzLines: { color: '#444' } },
            priceScale: { borderColor: '#71649C' },
            timeScale: { borderColor: '#71649C', timeVisible: true, secondsVisible: false },
        });

        const candleSeries = chart.addCandlestickSeries({
            upColor: '#26a69a', downColor: '#ef5350',
            borderDownColor: '#ef5350', borderUpColor: '#26a69a',
            wickDownColor: '#ef5350', wickUpColor: '#26a69a',
        });

        const basePrice = selectedStock.openPrice || 100;
        const data = Array.from({ length: 6 }).map((_, i) => {
            const open = basePrice + Math.random() * 2;
            const close = open + (Math.random() - 0.5) * 4;
            const high = Math.max(open, close) + Math.random();
            const low = Math.min(open, close) - Math.random();
            return {
                time: `2025-06-0${i + 1}`,
                open: parseFloat(open.toFixed(2)),
                high: parseFloat(high.toFixed(2)),
                low: parseFloat(low.toFixed(2)),
                close: parseFloat(close.toFixed(2))
            };
        });

        candleSeries.setData(data);

        return () => chart.remove();
    }, [selectedStock]);


    // notificatin alert
    useEffect(() => {
        const socket = new SockJS("http://localhost:8080/ws");
        const client = new Client({
            webSocketFactory: () => socket,
            debug: (str) => console.log(str),
            onConnect: () => {
                console.log("Connected to notification WebSocket");

                client.subscribe("/topic/notifications", (message) => {
                    const notification = JSON.parse(message.body);

                    // 👉 First show an alert
                    alert(`📢 ${notification.message}`);

                    // 👉 Then update the notification state
                    setNotifications(prev => [...prev, notification]);
                });
            },
            onStompError: (frame) => {
                console.error("WebSocket STOMP error:", frame.headers["message"]);
            },
        });

        client.activate();

        return () => client.deactivate();
    }, []);

    //news
    const fetchNews = async () => {
        try {
            const apiKey = 'pub_87fac4a256b0402581f24ad2bd9cdf94';
            const url = `https://newsdata.io/api/1/latest?apikey=${apiKey}&q=share%20market`;
            const res = await axios.get(url);
            setNews(res.data.results || []);
            setShowNews(true);
        } catch (err) {
            console.error('News fetch error:', err);
        }
    };

    return (
        <>
            <nav className="navbar">
                <div className="navbar-logo">📊 StockLive</div>
                <div className="navbar-buttons">
                    <div className="notification-container">
                        <button className="nav-btn" onClick={() => setShowNotifications(!showNotifications)}>
                            🔔 Notifications ({notifications.length})
                        </button>
                        {showNotifications && (
                            <div className="notification-popup">
                                {notifications.length === 0 ? (
                                    <p>No notifications</p>
                                ) : (
                                    <ul>
                                        {notifications.map((n, index) => (
                                            <li key={index}>{n.message}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>

                    {/* // inside return, News button  left */}
                    <button className="nav-btn" onClick={() => setShowChat(!showChat)}>💬 Chat</button>

                    {/* toggle button */}
                    {showChat && <ChatBox username="user" receiver="admin" />}




                    <button className="nav-btn" onClick={fetchNews}>📰 News</button>

                    <button className="nav-btn" onClick={handleLogout}>🚪 Logout</button>

                </div>
            </nav>

            <div className="dashboard">
                <div className="stock-list">
                    <h3>Select a Stock</h3>
                    <ul>
                        {stocks.map((stock) => (
                            <li
                                key={stock.id}
                                onClick={() => setSelectedStock(stock)}
                                className={selectedStock?.id === stock.id ? 'active' : ''}
                            >
                                {stock.name} ({stock.symbol}) - ${stock.price.toFixed(2)}
                            </li>
                        ))}
                    </ul>
                </div>

                {selectedStock && (
                    <div className="stock-details">
                        <h2>{selectedStock.name} ({selectedStock.symbol})</h2>
                        <p><strong>Price:</strong> ${selectedStock.price.toFixed(2)}</p>
                        <p><strong>Open:</strong> ${selectedStock.openPrice.toFixed(2)}</p>
                        <p><strong>Close:</strong> ${selectedStock.closePrice.toFixed(2)}</p>
                        <p><strong>Volume:</strong> {selectedStock.volume}</p>

                        <div className="chart-section">
                            <div className="chart-container" ref={chartContainerRef}></div>
                        </div>
                    </div>
                )}
            </div>
            {showNews && (
                <div className="news-popup">
                    {news.map((a, i) => (
                        <div key={i} className="news-item">
                            <h4>{a.title}</h4>
                            <p>{a.description}</p>
                            <a href={a.link} target="_blank">Read</a>
                        </div>
                    ))}
                    {!news.length && <p>No news found.</p>}

                </div>


            )}
        </>
    );
};

export default UserDashboard;
