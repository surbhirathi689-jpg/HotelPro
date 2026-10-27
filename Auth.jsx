import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
export default function Auth({ mode }) {
  const { login, register } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ name: '', email: '', password: '', phone: '' });
  const [err, setErr] = useState('');
  const isReg = mode === 'register';
  const submit = async (e) => {
    e.preventDefault();
    try { await (isReg ? register(f) : login(f)); nav('/'); }
    catch (x) { setErr(x.response?.data?.message || 'Something went wrong'); }
  };
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  return (
    <form onSubmit={submit} className="mx-auto" style={{ maxWidth: 400 }}>
      <h3>{isReg ? 'Create account' : 'Login'}</h3>
      {err && <div className="alert alert-danger">{err}</div>}
      {isReg && <><input className="form-control mb-2" placeholder="Name" required onChange={set('name')} />
        <input className="form-control mb-2" placeholder="Phone" onChange={set('phone')} /></>}
      <input className="form-control mb-2" type="email" placeholder="Email" required onChange={set('email')} />
      <input className="form-control mb-3" type="password" placeholder="Password" required minLength={6} onChange={set('password')} />
      <button className="btn btn-primary w-100">{isReg ? 'Register' : 'Login'}</button>
    </form>
  );
}
