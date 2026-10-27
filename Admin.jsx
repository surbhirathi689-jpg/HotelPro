import { useEffect, useState } from 'react';
import api from '../api';
const empty = { number: '', type: 'single', price: '', capacity: 2, description: '', amenities: '' };
export default function Admin() {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [f, setF] = useState(empty);
  const load = () => { api.get('/bookings').then((r) => setBookings(r.data)); api.get('/rooms').then((r) => setRooms(r.data)); };
  useEffect(() => { load(); }, []);
  const addRoom = async (e) => {
    e.preventDefault();
    await api.post('/rooms', { ...f, amenities: f.amenities.split(',').map((s) => s.trim()).filter(Boolean) });
    setF(empty); load();
  };
  const setStatus = async (id, status) => { await api.put(`/bookings/${id}/status`, { status }); load(); };
  const delRoom = async (id) => { await api.delete(`/rooms/${id}`); load(); };
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  return (
    <>
      <h4>Bookings</h4>
      <table className="table table-sm">
        <thead><tr><th>Guest</th><th>Room</th><th>Dates</th><th>Paid</th><th>Status</th></tr></thead>
        <tbody>{bookings.map((b) => (
          <tr key={b._id}>
            <td>{b.user?.name}<br /><small>{b.user?.email}</small></td><td>{b.room?.number}</td>
            <td>{b.checkIn.slice(0, 10)} → {b.checkOut.slice(0, 10)}</td><td>{b.paymentStatus}</td>
            <td><select className="form-select form-select-sm" value={b.status} onChange={(e) => setStatus(b._id, e.target.value)}>
              {['pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled'].map((s) => <option key={s}>{s}</option>)}</select></td>
          </tr>))}</tbody>
      </table>
      <h4 className="mt-4">Rooms</h4>
      <form className="row g-2 mb-3" onSubmit={addRoom}>
        <div className="col-md-1"><input className="form-control" placeholder="No." required value={f.number} onChange={set('number')} /></div>
        <div className="col-md-2"><select className="form-select" value={f.type} onChange={set('type')}>{['single', 'double', 'suite', 'deluxe'].map((t) => <option key={t}>{t}</option>)}</select></div>
        <div className="col-md-2"><input className="form-control" type="number" placeholder="Price" required value={f.price} onChange={set('price')} /></div>
        <div className="col-md-2"><input className="form-control" placeholder="Amenities (comma)" value={f.amenities} onChange={set('amenities')} /></div>
        <div className="col-md-3"><input className="form-control" placeholder="Description" value={f.description} onChange={set('description')} /></div>
        <div className="col-md-2"><button className="btn btn-primary w-100">Add room</button></div>
      </form>
      <ul className="list-group">{rooms.map((r) => (
        <li className="list-group-item d-flex justify-content-between" key={r._id}>
          <span>Room {r.number} – {r.type} – ₹{r.price}</span>
          <button className="btn btn-sm btn-outline-danger" onClick={() => delRoom(r._id)}>Delete</button>
        </li>))}</ul>
    </>
  );
}
