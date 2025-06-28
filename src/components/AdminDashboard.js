import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import "./AdminDashboard.css";

import { FaComments } from 'react-icons/fa';
import ChatBox from './ChatBox';
import { useNavigate } from 'react-router-dom'; // ✅ For navigation



const AdminDashboard = () => {
  const navigate = useNavigate(); // ✅ useNavigate hook

  const [data, setData] = useState([]);
  const [holdings, setHoldings] = useState([]);
  const [imageName, setImageName] = useState('');
  const [newProperty, setNewProperty] = useState({ img: '' });

  const [message, setMessage] = useState("");

  // inside component
  const [showChat, setShowChat] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editStock, setEditStock] = useState({});
  const [newStock, setNewStock] = useState({
    name: "",
    price: "",
    openPrice: "",
    closePrice: "",
    volume: "",
    imageName: "",
  });



  const stompClient = useRef(null);
  // Calculate Gain/Loss helper
  const calculateGain = (buy, current) => {
    const diff = current - buy;
    const percent = ((diff / buy) * 100).toFixed(2);
    return {
      text: `$${diff.toFixed(2)} (${percent}%)`,
      color: diff >= 0 ? "#28a745" : "#dc3545",
    };
  };

  // Map stocks data for chart and holdings table
  const mapStocksData = (stocks) => {
    const chartData = stocks.map((stock) => ({
      name: stock.name,
      value: stock.price,
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    }));
    const holdingsData = stocks.map(stock => ({
      id: stock.id,
      stock: stock.name,
      ticker: stock.symbol,
      price: stock.price,
      quantity: 1,
      buy: stock.openPrice,
      current: stock.price,
      closePrice: stock.closePrice,
      volume: stock.volume,
      img: stock.imageUrl,        // Mapped here
    }));

    setData(chartData);
    setHoldings(holdingsData);
  };

  // Fetch stocks from backend API
  const fetchStocks = async () => {
    try {
      const response = await axios.get("http://localhost:8080/stocks/findall");
      mapStocksData(response.data);
    } catch (err) {
      console.error("Error fetching stocks", err);
    }
  };

  // ✅ Handle Logout
  const handleLogout = () => {
    localStorage.clear();      // Clear session/localStorage
    navigate('/');             // Redirect to login page
  };




  // Initial fetch
  useEffect(() => {
    fetchStocks();
  }, []);

  // Setup WebSocket for live updates
  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (str) => console.log(str),
    });

    stompClient.current.onConnect = () => {
      stompClient.current.subscribe("/topic/stocks", (message) => {
        if (message.body) {
          const updatedStocks = JSON.parse(message.body);
          mapStocksData(updatedStocks);
          // If editing a stock that was deleted, cancel edit mode
          if (editIndex !== null) {
            const editingId = holdings[editIndex]?.id;
            if (!updatedStocks.some((s) => s.id === editingId)) {
              setEditIndex(null);
              setEditStock({});
            }
          }
        }
      });
    };

    stompClient.current.activate();

    return () => {
      if (stompClient.current) stompClient.current.deactivate();
    };
  }, [editIndex, holdings]);

  // Add new stock handler
  const handleAddStock = async () => {
    const { name, price, openPrice, closePrice, volume, imageName } = newStock;

    if (!name || !price || !openPrice || !closePrice || !volume || !imageName) {
      alert("Please fill all fields and select an image name");
      return;
    }

    const payload = {
      name,
      price: parseFloat(price),
      openPrice: parseFloat(openPrice),
      closePrice: parseFloat(closePrice),
      volume: parseInt(volume, 10),
      imageUrl: `/img/${imageName}`, // assuming image is placed in public/img
      updatedAt: new Date().toISOString(),
    };

    try {
      await axios.post("http://localhost:8080/stocks/saves", payload);
      alert("Stock added successfully!");
      setNewStock({
        name: "",
        price: "",
        openPrice: "",
        closePrice: "",
        volume: "",
        imageName: "",
      });
    } catch (error) {
      console.error("Error adding stock:", error);
      alert("Failed to add stock. Check console for details.");
    }
  };


  // Delete stock handler
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/stocks/delete/${id}`);
      await fetchStocks();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  // Start editing stock
  const handleEdit = (index) => {
    setEditIndex(index);
    const item = holdings[index];

    // Choose the correct URL field
    const fullUrl = item.img || item.imageUrl || "";

    // Extract filename (after last '/'), or empty string if none
    const imageName = fullUrl
      ? fullUrl.substring(fullUrl.lastIndexOf("/") + 1)
      : "";

    setEditStock({
      name: item.stock,
      symbol: item.ticker,
      price: item.price,
      openPrice: item.buy,
      closePrice: item.closePrice,
      volume: item.volume,
      imageName,    // now always defined (possibly "")
    });
  };




  //imgge upload
  const handleSimpleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setNewStock(prev => ({ ...prev, imageName: file.name }));
  };


  // Submit updated stock
  const handleUpdateSubmit = async (id) => {
    try {
      const updatedData = {
        ...editStock,
        price: parseFloat(editStock.price),
        openPrice: parseFloat(editStock.openPrice),
        closePrice: parseFloat(editStock.closePrice),
        volume: parseInt(editStock.volume, 10),
        imageUrl: `/img/${editStock.imageName}`,  // ← include this
        updatedAt: new Date().toISOString(),
      };
      await axios.put(`http://localhost:8080/stocks/update/${id}`, updatedData);
      setEditIndex(null);
      await fetchStocks();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditStock((prev) => ({ ...prev, imageName: file.name }));
  };

  // notification
  const handleSendNotification = async () => {
    try {
      await axios.post("http://localhost:8080/notification/save", {
        message: message,
      });
      alert("Notification sent!");
      setMessage("");
    } catch (error) {
      console.error("Error sending notification", error);
    }
  };



  return (


    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2 className="dashboard-title">📈 Stock Portfolio Dashboard</h2>
        <button className="logout-button" onClick={handleLogout} >🚪 Logout</button>
      </div>      <div className="cards-container">
        <div className="card">
          <p className="card-title">Total Investment</p>
          <h3 className="card-value">$2422.91</h3>
        </div>
        <div className="card">
          <p className="card-title">Current Value</p>
          <h3 className="card-value">$3237.56</h3>
        </div>
        <div className="card">
          <p className="card-title">Total Gain/Loss</p>
          <h3 className="card-value gain">$814.65</h3>
        </div>
        <div className="card">
          <p className="card-title">Return</p>
          <h3 className="card-value gain">33.62%</h3>
        </div>
      </div>
      <h2>Send Notification</h2>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter notification"
      />
      <button onClick={handleSendNotification}>Send</button>

      <div>
        {/* // inside return (notification text field ) */}
        <button onClick={() => setShowChat(!showChat)} className="chat-icon-btn">
          <FaComments size={20} />
        </button>

        {/* {showChat && <ChatBox userType="admin" />} */}

        {/* toggle button */}
        {showChat && <ChatBox username="admin" receiver="user" />}


      </div>

      <div className="chart-container">
        <h3 className="chart-title">Portfolio Weightage</h3>
        <div className="chart-content">
          <ResponsiveContainer width={400} height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {data.map((entry, index) => (
                  <Cell key={`cell - ${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <div className="custom-legend">
            {data.map((entry, index) => (
              <div key={index} className="legend-item">
                <span
                  className="legend-color"
                  style={{ backgroundColor: entry.color }}
                ></span>
                <span className="legend-text">{entry.name}</span>
                <span className="legend-price"> (${entry.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>



      <div className="holdings-container">
        <div className="holdings-header">
          <h3>Portfolio Holdings</h3>
          <button
            className="add-stock-btn"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancel" : "Add Stock"}
          </button>
        </div>

        {showForm && (
          <div className="add-stock-form">
            <input
              type="text"
              placeholder="Stock Name"
              value={newStock.name}
              onChange={(e) =>
                setNewStock({ ...newStock, name: e.target.value })
              }
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleSimpleUpload}
            />

            <input
              type="number"
              placeholder="Current Price"
              value={newStock.price}
              onChange={(e) =>
                setNewStock({ ...newStock, price: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Open Price"
              value={newStock.openPrice}
              onChange={(e) =>
                setNewStock({ ...newStock, openPrice: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Close Price"
              value={newStock.closePrice}
              onChange={(e) =>
                setNewStock({ ...newStock, closePrice: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Volume"
              value={newStock.volume}
              onChange={(e) =>
                setNewStock({ ...newStock, volume: e.target.value })
              }
            />
            <button className="submit-stock-btn" onClick={handleAddStock}>
              Submit
            </button>
          </div>
        )}

        <table className="holdings-table">
          <thead>
            <tr>
              <th>Stock Name</th>
              <th>Ticker</th>
              <th>Quantity</th>
              <th>Buy Price</th>
              <th>Current Price</th>
              <th>Prev Close</th>        {/* NEW */}
              <th>Volume</th>            {/* NEW */}
              <th>Gain/Loss</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((item, index) => {
              const gain = calculateGain(item.buy, item.current);
              return (
                <tr key={index}>
                  <td>
                    {editIndex === index ? (
                      <input
                        value={editStock.name}
                        onChange={(e) =>
                          setEditStock({ ...editStock, name: e.target.value })
                        }
                      />
                    ) : (
                      item.stock
                    )}
                  </td>
                  <td>
                    {editIndex === index ? (
                      <>
                        {/* Preview of current or newly chosen image */}
                        <img
                          src={`/img/${editStock.imageName}`}
                          alt={editStock.name}
                          style={{
                            width: 40,
                            height: 40,
                            objectFit: "cover",
                            borderRadius: "50%",
                            marginRight: 8,
                          }}
                        />
                        {/* File input to choose a new file */}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleEditImageChange}
                          style={{ verticalAlign: "middle" }}
                        />
                      </>
                    ) : (
                      <img
                        src={item.img || item.imageUrl}
                        alt={item.stock}
                        style={{
                          width: 40,
                          height: 40,
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                      />
                    )}
                  </td>



                  <td>{item.quantity}</td>
                  <td>
                    {editIndex === index ? (
                      <input
                        value={editStock.openPrice}
                        onChange={(e) =>
                          setEditStock({ ...editStock, openPrice: e.target.value })
                        }
                      />
                    ) : (
                      `$${item.buy}`
                    )}
                  </td>
                  <td>
                    {editIndex === index ? (
                      <input
                        type="number"
                        value={editStock.closePrice}
                        onChange={(e) =>
                          setEditStock({ ...editStock, closePrice: e.target.value })
                        }
                      />
                    ) : (
                      `$${item.closePrice}`
                    )}
                  </td>
                  <td>
                    {editIndex === index ? (
                      <input
                        type="number"
                        value={editStock.volume}
                        onChange={(e) =>
                          setEditStock({ ...editStock, volume: e.target.value })
                        }
                      />
                    ) : (
                      item.volume
                    )}
                  </td>
                  <td>
                    {editIndex === index ? (
                      <input
                        value={editStock.price}
                        onChange={(e) =>
                          setEditStock({ ...editStock, price: e.target.value })
                        }
                      />
                    ) : (
                      ` $${item.current}`
                    )}
                  </td>
                  <td style={{ color: gain.color }}>{gain.text}</td>
                  <td>
                    {editIndex === index ? (
                      <>
                        <button
                          className="action-btn"
                          onClick={() => handleUpdateSubmit(item.id)}
                        >
                          💾
                        </button>
                        <button
                          className="action-btn"
                          onClick={() => setEditIndex(null)}
                        >
                          ❌
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="action-btn"
                          onClick={() => handleEdit(index)}
                        >
                          ✏️
                        </button>
                        <button
                          className="action-btn"
                          onClick={() => handleDelete(item.id)}
                        >
                          🗑️
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>


      </div>
    </div>
  );
};

export default AdminDashboard;