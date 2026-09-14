import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';

const ExpertList = () => {

    const [experts, setExperts] = useState([]);
    const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
    const [category, setCategory] = useState('');
    const [sort, setSort] = useState('createdAt');
    const [search, setSearch] = useState('');
    const limit = 6;

  useEffect(() => {
    setPage(1);
  }, [category, sort, search]);

    useEffect(() => {
        fetchExperts();
    }, [page, category, sort, search]);

    const fetchExperts = async () => {
        try {
            const response = await API.get('/experts', {
                params: { page, category, sort, search, limit }
            });
            setExperts(response.data.experts);
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            console.error('Error fetching experts:', error);
        }
    }
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <header className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Find Your Expert</p>
              <h1 className="mt-2 text-3xl font-serif text-slate-900">Experts</h1>
              <p className="mt-2 text-sm text-slate-600">
                Browse curated specialists and book your next session.
              </p>
              <h2>Total pages: {totalPages}</h2>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <select
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
              >
                <option value="">All Categories</option>
                <option value="Fitness">Fitness</option>
                <option value="Finance">Finance</option>
                <option value="Career">Career</option>
                <option value="Health">Health</option>
                <option value="Technology">Technology</option>
              </select>

              <select
                onChange={(e) => setSort(e.target.value)}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
              >
                <option value="createdAt">Newest</option>
                <option value="rating">Rating</option>
                <option value="experience">Experience</option>
              </select>

              <input
                type="text"
                placeholder="Search by name"
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200 sm:w-64"
              />
               <Link
                to="/my-bookings"
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-500 hover:text-teal-700"
              >
                My Bookings
              </Link>
            </div>
          </header>

          <section className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {experts.map((expert) => (
              <div
                key={expert._id}
                className="group rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Expert</p>
                    <Link to={`/expert/${expert._id}`}>
                      <h3 className="mt-2 text-xl font-serif text-slate-900 transition group-hover:text-teal-700">
                        {expert.name}
                      </h3>
                    </Link>
                  </div>
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                    {expert.rating} ⭐
                  </span>
                </div>
                <p className="mt-4 text-sm text-slate-600">{expert.category}</p>
                <p className="mt-2 text-sm text-slate-500">
                  {expert.experience}+ years experience
                </p>
                <div className="mt-6">
                  <Link
                    to={`/expert/${expert._id}`}
                    className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-500 hover:text-teal-700"
                  >
                    View profile
                  </Link>
                </div>
              </div>
            ))}
          </section>

          <div className="mt-10 flex items-center justify-center gap-3">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-sm text-slate-500">Page {page}</span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
              className="rounded-full bg-teal-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
}
export default ExpertList;