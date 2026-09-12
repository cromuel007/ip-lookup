import { FormEvent, useEffect, useRef, useState } from "react";
import * as Flags from "country-flag-icons/react/3x2";
import IpMap from "./components/IpMap";
import { getMyIp, lookupIp } from "./services/ipApi";
import type { IpLookupResponse } from "./types/ip";

function CountryFlag({
  countryCode,
}: {
  countryCode: string | null;
}) {
  if (!countryCode) {
    return null;
  }

  const code =
    countryCode.toUpperCase() as keyof typeof Flags;

  const Flag = Flags[code];

  if (!Flag) {
    return null;
  }

  return (
    <span
      className="inline-flex h-[18px] w-[27px] items-center justify-center overflow-hidden rounded-[2px]"
      title={countryCode}
    >
      <Flag
        width={27}
        height={18}
        className="block h-[18px] w-[27px]"
      />
    </span>
  );
}

function App() {
  // IP currently being searched
  const [ip, setIp] = useState("");

  // Visitor's detected IP - never changed by the input
  const [myIp, setMyIp] = useState("");

  const [result, setResult] =
    useState<IpLookupResponse | null>(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [findingIp, setFindingIp] = useState(false);
  const [loadingDots, setLoadingDots] = useState(".");
  const resultRef = useRef<HTMLElement | null>(null);
  const [myIpClicked, setMyIpClicked] = useState(false);

  async function performLookup(value: string) {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      setError("Please enter an IP address.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await lookupIp(trimmedValue);
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to lookup IP address",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setMyIpClicked(false);
    
    await performLookup(ip);
  }

  async function handleMyIpClick() {
    if (!myIp.trim()) {
      return;
    }

    setMyIpClicked(true);
    setIp(myIp);

    await performLookup(myIp);
  }

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [result]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingDots((dots) =>
        dots.length === 3 ? "" : dots + ".",
      );
    }, 400);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function loadMyIp() {
      setFindingIp(true);

      try {
        const userIp = await getMyIp();

        setMyIp(userIp);
      } catch (error) {
        console.error("Failed to get user IP:", error);
      } finally {
        setFindingIp(false);
      }
    }

    loadMyIp();
  }, []);

  return (
    <main className="modern-background min-h-screen px-4 py-10 text-slate-200 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <header className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            IP Lookup
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            Quickly discover approximate geographic information
            associated with an IP address.
          </p>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            Your IP address:{" "}
            {findingIp ? (
              <>
                Finding your IP
                <span className="inline-block w-[18px] text-left">
                  {loadingDots}
                </span>
              </>
            ) : (
              <button
                type="button"
                onClick={handleMyIpClick}
                disabled={loading || !myIp}
                className="font-medium text-blue-400 underline decoration-blue-400/40 underline-offset-4 transition-colors hover:text-blue-300 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {myIp}
              </button>
            )}
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="modern-card mx-auto mt-10 max-w-4xl rounded-2xl p-3 sm:p-4"
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="modern-input flex min-w-0 flex-1 items-center rounded-xl px-4">
              <span className="mr-3 hidden whitespace-nowrap text-sm font-medium text-slate-500 sm:block">
                IP
              </span>

              <input
                type="text"
                value={ip}
                onChange={(event) => {
                  setIp(event.target.value);
                }}
                placeholder="Enter an IP address..."
                className="w-full bg-transparent py-3.5 text-sm text-white outline-none placeholder:text-slate-600 sm:text-base"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="modern-button rounded-xl px-7 py-3.5 text-sm font-semibold text-white"
            >
              {loading ? (
                <>
                  Looking up
                  <span className="inline-block w-[18px] text-left">
                    {loadingDots}
                  </span>
                </>
              ) : (
                "Lookup IP"
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="modern-error mx-auto mt-5 max-w-4xl rounded-xl px-5 py-4 text-sm text-red-300">
            <span className="mr-2 font-semibold text-red-400">
              Error:
            </span>
            {error}
          </div>
        )}

        {result && (
          <section
            ref={resultRef}
            className="modern-result-animation modern-card mx-auto mt-8 max-w-6xl scroll-mt-6 overflow-hidden rounded-2xl"
          >
            <div className="flex flex-col gap-3 border-b border-slate-800/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <div className="text-[11px] font-medium uppercase tracking-widest text-slate-500">
                  Lookup Result
                </div>

                <h2 className="mt-1 text-lg font-semibold text-white">
                  {result.ip}
                </h2>
              </div>

              <div className="modern-status text-xs font-medium text-slate-400">
                Lookup successful
              </div>
            </div>

            <div className="grid gap-2.5 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
              <div className="modern-result-item rounded-lg p-3">
                <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                  IP Address
                </p>

                <p className="mt-1.5 break-all text-sm font-medium text-slate-200">
                  {result.ip}
                </p>
              </div>

              <div className="modern-result-item rounded-lg p-3">
                <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                  Country
                </p>

                <div className="mt-1.5 flex items-center gap-2 text-sm font-medium text-slate-200">
                  <CountryFlag
                    countryCode={result.country.code}
                  />

                  <span>
                    {result.country.name || "Unknown"}
                    {result.country.code &&
                      ` (${result.country.code})`}
                  </span>
                </div>
              </div>

              <div className="modern-result-item rounded-lg p-3">
                <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                  Region
                </p>

                <p className="mt-1.5 text-sm font-medium text-slate-200">
                  {result.region || "Unknown"}
                </p>
              </div>

              <div className="modern-result-item rounded-lg p-3">
                <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                  City
                </p>

                <p className="mt-1.5 text-sm font-medium text-slate-200">
                  {result.city || "Unknown"}
                </p>
              </div>

              <div className="modern-result-item rounded-lg p-3">
                <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                  Timezone
                </p>

                <p className="mt-1.5 text-sm font-medium text-slate-200">
                  {result.timezone || "Unknown"}
                </p>
              </div>

              <div className="modern-result-item rounded-lg p-3">
                <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                  Coordinates
                </p>

                <p className="mt-1.5 text-sm font-medium text-slate-200">
                  {result.location.latitude ?? "Unknown"}
                  {result.location.latitude !== null &&
                    result.location.longitude !== null &&
                    ", "}
                  {result.location.longitude ?? ""}
                </p>
              </div>
            </div>

            {result.location.latitude !== null &&
              result.location.longitude !== null && (
                <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                  <div className="modern-map-header mb-2 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider">
                    <span className="modern-map-dot h-2 w-2 rounded-full" />
                    Approximate Location
                  </div>

                  <IpMap
                    latitude={result.location.latitude}
                    longitude={result.location.longitude}
                    ip={result.ip}
                    myIpClicked={myIpClicked}
                  />
                </div>
              )}
          </section>
        )}

        <footer className="mt-10 text-center text-xs text-slate-600">
          © {new Date().getFullYear()}{" "}
          <a
            href="https://www.linkedin.com/in/cromuel/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-slate-300"
          >
            Cromuel
          </a>{" "}
          🍆. All rights reserved.
        </footer>
      </div>
    </main>
  );
}

export default App;