import { useCallback, useEffect, useRef, useState } from "react";
import { NavLink, useLocation, Navigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import PhotoCard from "../components/PhotoCard";
import TripCard from "../components/TripCard";
import UserTravelsPage from "../components/UserTravelsPage";
import ExploreSearchBar, { ExploreViewToggle } from "../components/ExploreFilters";
import { CardGridSkeleton, PageSpinner } from "../components/LoadingSkeleton";

const PAGE_SIZE = 12;

function useExploreFeed(endpoint, searchQuery, idKey) {
  const [items, setItems] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const sentinelRef = useRef(null);
  const loadingMoreRef = useRef(false);
  const nextCursorRef = useRef(null);

  const loadPage = useCallback(
    async (cursor, append) => {
      const params = new URLSearchParams({ limit: String(PAGE_SIZE) });
      if (cursor) params.set("cursor", cursor);
      if (searchQuery) params.set("q", searchQuery);

      const data = await api.get(`${endpoint}?${params}`);
      const page = data[idKey === "photoId" ? "photos" : "trips"];
      setItems((prev) => (append ? [...prev, ...page] : page));
      setNextCursor(data.nextCursor);
    },
    [endpoint, searchQuery, idKey]
  );

  useEffect(() => {
    setLoading(true);
    setError(null);
    loadPage(null, false)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [loadPage]);

  useEffect(() => {
    loadingMoreRef.current = loadingMore;
  }, [loadingMore]);

  useEffect(() => {
    nextCursorRef.current = nextCursor;
  }, [nextCursor]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const cursor = nextCursorRef.current;
        if (!entries[0].isIntersecting || loadingMoreRef.current || !cursor) return;
        loadingMoreRef.current = true;
        setLoadingMore(true);
        loadPage(cursor, true)
          .catch((err) => setError(err.message))
          .finally(() => {
            loadingMoreRef.current = false;
            setLoadingMore(false);
          });
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [loadPage, items.length, nextCursor]);

  return { items, loading, loadingMore, error, sentinelRef, nextCursor };
}

function ExplorePhotosFeed({ searchQuery }) {
  const { items, loading, loadingMore, error, sentinelRef, nextCursor } = useExploreFeed(
    "/feed",
    searchQuery,
    "photoId"
  );

  if (loading) return <CardGridSkeleton />;
  if (error) return <p className="page-error">{error}</p>;
  if (items.length === 0) {
    return <p className="empty-state">No photos match your search.</p>;
  }

  return (
    <>
      {items.map((photo) => (
        <PhotoCard key={photo.photoId} photo={photo} />
      ))}
      {nextCursor && (
        <div ref={sentinelRef} className="feed-sentinel">
          {loadingMore && <PageSpinner small />}
        </div>
      )}
    </>
  );
}

function ExploreTripsFeed({ searchQuery }) {
  const { items, loading, loadingMore, error, sentinelRef, nextCursor } = useExploreFeed(
    "/feed/trips",
    searchQuery,
    "tripId"
  );

  if (loading) return <CardGridSkeleton />;
  if (error) return <p className="page-error">{error}</p>;
  if (items.length === 0) {
    return <p className="empty-state">No trips match your search.</p>;
  }

  return (
    <>
      {items.map((trip) => (
        <TripCard key={trip.tripId} trip={trip} />
      ))}
      {nextCursor && (
        <div ref={sentinelRef} className="feed-sentinel">
          {loadingMore && <PageSpinner small />}
        </div>
      )}
    </>
  );
}

function ExploreSection() {
  const [searchParams, setSearchParams] = useSearchParams();
  const view = searchParams.get("view") === "trips" ? "trips" : "photos";
  const searchQuery = searchParams.get("q") || "";

  const setView = (next) => {
    const params = new URLSearchParams(searchParams);
    if (next === "trips") params.set("view", "trips");
    else params.delete("view");
    setSearchParams(params, { replace: true });
  };

  const setSearchQuery = useCallback(
    (q) => {
      const params = new URLSearchParams(searchParams);
      if (q.trim()) params.set("q", q.trim());
      else params.delete("q");
      setSearchParams(params, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  return (
    <>
      <ExploreViewToggle view={view} onChange={setView} />
      <ExploreSearchBar value={searchQuery} onChange={setSearchQuery} />
      <div className="main-cont">
        {view === "trips" ? (
          <ExploreTripsFeed searchQuery={searchQuery} />
        ) : (
          <ExplorePhotosFeed searchQuery={searchQuery} />
        )}
      </div>
    </>
  );
}

function MyTravelsFeed() {
  const { user } = useAuth();
  if (!user) return null;
  return <UserTravelsPage uid={user.uid} isOwnProfile />;
}

export default function Home() {
  const location = useLocation();
  const isMyTravels = location.pathname === "/my-travels";

  return (
    <div className="page-container">
      <div className="page-title-row">
        <nav className="page-tabs" aria-label="Main navigation">
          <NavLink to="/" end className="page-tab">
            Explore
          </NavLink>
          <NavLink to="/my-travels" className="page-tab">
            My Travels
          </NavLink>
        </nav>
        {isMyTravels && (
          <div className="page-actions">
            <NavLink to="/create-photo" className="btn-secondary btn-sm">
              + Post Photo
            </NavLink>
            <NavLink to="/create" className="btn-primary btn-sm">
              + New Trip
            </NavLink>
          </div>
        )}
      </div>
      {isMyTravels ? <MyTravelsFeed /> : <ExploreSection />}
    </div>
  );
}

export function HomeMyTravels() {
  const { user, loading } = useAuth();
  if (loading) return <PageSpinner />;
  if (!user) return <Navigate to="/signin" replace />;
  return <Home />;
}
