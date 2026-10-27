import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../AuthContext';
export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [d, setD] = useState({ checkIn: '', checkOut: '' });
  const [msg, setMsg] = useState('');
  const { user } = useAuth();
  const nav = useNavigate();
  const load = () => api.get('/rooms', { params: d.checkIn && d.checkOut ? d : {} }).then((r) => setRooms(r.data));
  useEffect(() => { load(); }, []);
  const book = async (room) => {
    if (!user) return nav('/login');
    if (!d.checkIn || !d.checkOut) return setMsg('Select check-in and check-out dates first.');
    try { await api.post('/bookings', { room, ...d, guests: 1 }); nav('/my-bookings'); }
    catch (e) { setMsg(e.response?.data?.message || 'Booking failed'); }
  };
  return (
    <>
      <div className="row g-2 mb-3">
        <div className="col-md-4"><input type="date" className="form-control" onChange={(e) => setD({ ...d, checkIn: e.target.value })} /></div>
        <div className="col-md-4"><input type="date" className="form-control" onChange={(e) => setD({ ...d, checkOut: e.target.value })} /></div>
        <div className="col-md-4"><button className="btn btn-primary w-100" onClick={load}>Check availability</button></div>
      </div>
      {msg && <div className="alert alert-warning">{msg}</div>}
      <div className="row">
        {rooms.map((r) => (
          <div className="col-md-4 mb-3" key={r._id}>
            <div className="card h-100"><div className="card-body">
              <h5>Room {r.number} <span className="badge bg-secondary text-capitalize">{r.type}</span></h5>
              <p className="text-muted mb-1">{r.description}</p>
              <p className="small">Sleeps {r.capacity} · {r.amenities?.join(', ')}</p>
              <h6>₹{r.price} / night</h6>
              <button className="btn btn-success btn-sm" onClick={() => book(r._id)}>Book now</button>
            </div></div>
          </div>
        ))}
        {!rooms.length && <p>No rooms available.</p>}
      </div>
    </>
  );
}
