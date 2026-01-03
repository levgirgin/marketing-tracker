import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const API_URL = "http://localhost:8000/campaigns/";

function App() {
  // 1. All State definitions
  const [campaigns, setCampaigns] = useState([]);
  const [formData, setFormData] = useState({
    name: '', spend: 0, clicks: 0, impressions: 0, conversions: 0
  });

  // 2. Function to get data from Backend
  const fetchCampaigns = async () => {
    try {
      const res = await axios.get(API_URL);
      setCampaigns(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // 3. Run fetch once when page loads
  useEffect(() => {
    // We define an internal function to handle the async call
    const loadInitialData = async () => {
      await fetchCampaigns();
    };

    loadInitialData();
    // The empty array [] means this ONLY runs once when the app starts
  }, []);

  // 4. Function to save new data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, {
        name: formData.name,
        spend: parseFloat(formData.spend) || 0,
        clicks: parseInt(formData.clicks) || 0,
        impressions: parseInt(formData.impressions) || 0,
        conversions: parseInt(formData.conversions) || 0
      });
      // Clear form and refresh list
      setFormData({ name: '', spend: 0, clicks: 0, impressions: 0, conversions: 0 });
      fetchCampaigns();
    } catch (err) {
      console.error("Save error:", err);
      alert("Could not save. Is the Python backend running?");
    }
  };

  // 5. The UI (Always renders, preventing "Blank Page")
  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', color: '#333' }}>
      <header style={{ borderBottom: '2px solid #eee', marginBottom: '20px' }}>
        <h1>📈 Marketing Performance Tracker</h1>
      </header>

      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        
        {/* LEFT SIDE: FORM */}
        <section style={{ flex: '1', minWidth: '300px' }}>
          <h3>Add New Campaign</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px' }}>
            <h4>Campaign Name</h4>
            <input type="text" placeholder="Campaign Name" required
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} 
              style={{ padding: '8px' }} />
            <h4>Spend ($)</h4>
            <input type="number" placeholder="Spend ($)" 
              value={formData.spend} onChange={e => setFormData({...formData, spend: e.target.value})} 
              style={{ padding: '8px' }} />
            <h4>Impressions</h4>
            <input type="number" placeholder="Impressions" 
              value={formData.impressions} onChange={e => setFormData({...formData, impressions: e.target.value})} 
              style={{ padding: '8px' }} />
            <h4>Clicks</h4>
            <input type="number" placeholder="Clicks" 
              value={formData.clicks} onChange={e => setFormData({...formData, clicks: e.target.value})} 
              style={{ padding: '8px' }} />
            <h4>Conversions</h4>
            <input type="number" placeholder="Conversions" 
              value={formData.conversions} onChange={e => setFormData({...formData, conversions: e.target.value})} 
              style={{ padding: '8px' }} />
            <button type="submit" style={{ background: '#007bff', color: '#fff', border: 'none', padding: '10px', cursor: 'pointer', borderRadius: '4px' }}>
              Add to Dashboard
            </button>
          </form>
        </section>

        {/* RIGHT SIDE: CHART */}
<section style={{ flex: '2', minWidth: '400px', height: '300px', background: '#fcfcfc', padding: '10px', borderRadius: '8px' }}>
  <h3>Spend Visualization</h3>
  {campaigns.length > 0 ? (
    <BarChart width={500} height={250} data={campaigns}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="spend" fill="#007bff" />
    </BarChart>
  ) : (
    <p>No data to visualize yet.</p>
  )}
</section>
      </div>

      {/* BOTTOM: TABLE */}
      <section style={{ marginTop: '40px' }}>
        <h3>Campaign Metrics</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ background: '#f4f4f4', textAlign: 'left' }}>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Name</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Spend</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>CTR (%)</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>CPC ($)</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>CPA ($)</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map(c => (
              <tr key={c.id}>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{c.name}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>${c.spend}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{c.ctr}%</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>${c.cpc}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>${c.cpa}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {campaigns.length === 0 && <p style={{ textAlign: 'center', padding: '20px' }}>No campaigns found. Use the form above to add one!</p>}
      </section>
    </div>
  );
}

export default App; 