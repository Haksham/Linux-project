'use client';
import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { io } from 'socket.io-client';

const MASTER_URL = 'http://localhost:4000';
const SYNC_INTERVAL = 5000;
const DRIFT_RATE = 0.01;
const OUT_OF_SYNC_THRESHOLD = 2000;

const PartitionClock = forwardRef(function PartitionClock(
  { name, driftRate = DRIFT_RATE, onSyncStatus, isMaster = false },
  ref
) {
  const [displayTime, setDisplayTime] = useState(Date.now());
  const [lastMasterTime, setLastMasterTime] = useState(Date.now());
  const [manualDrift, setManualDrift] = useState(0);
  const lastTickRef = useRef(Date.now());

  // Expose syncNow to parent via ref (for slaves only)
  useImperativeHandle(ref, () => ({
    syncNow: () => {
      if (!isMaster) {
        setDisplayTime(lastMasterTime);
        setManualDrift(0);
      }
    }
  }));

  // Sync with master at intervals
  useEffect(() => {
    const socket = io(MASTER_URL);

    socket.on('master_time', (unixSeconds) => {
      setLastMasterTime(unixSeconds * 1000);
      if (isMaster) setDisplayTime(unixSeconds * 1000); // Master always syncs to hardware
    });

    const syncTimer = setInterval(() => {
      if (!isMaster) setDisplayTime(lastMasterTime + manualDrift);
    }, SYNC_INTERVAL);

    return () => {
      clearInterval(syncTimer);
      socket.disconnect();
    };
  }, [manualDrift, lastMasterTime, isMaster]);

  // Local ticking with drift (slaves only)
  useEffect(() => {
    if (isMaster) return;
    const localTick = setInterval(() => {
      const now = Date.now();
      const delta = now - lastTickRef.current;
      lastTickRef.current = now;
      setDisplayTime(prev => prev + delta * (1 + driftRate));
    }, 100);

    return () => clearInterval(localTick);
  }, [driftRate, isMaster]);

  // Out-of-sync detection (slaves only)
  const outOfSync = !isMaster && Math.abs(displayTime - lastMasterTime) > OUT_OF_SYNC_THRESHOLD;

  // Report out-of-sync status to parent (slaves only)
  useEffect(() => {
    if (!isMaster && onSyncStatus) onSyncStatus(outOfSync);
  }, [outOfSync, onSyncStatus, isMaster]);

  // Simulate extra drift (slaves only)
  const handleSimulateDrift = () => {
    setDisplayTime(prev => prev + 5000);
    setManualDrift(prev => prev + 5000);
  };

  // Simulate timedatectl set-local-rtc 1 (immediate sync, slaves only)
  const handleSyncNow = () => {
    setDisplayTime(lastMasterTime);
    setManualDrift(0);
  };

  return (
    <div style={{
      padding: '1em',
      margin: '0.5em',
      border: isMaster
        ? '3px solid #1976d2'
        : outOfSync
          ? '3px solid #e53935'
          : '2px solid #90caf9',
      borderRadius: '10px',
      width: '240px',
      textAlign: 'center',
      background: isMaster
        ? 'linear-gradient(135deg, #1976d2 70%, #90caf9 100%)'
        : outOfSync
          ? '#ffebee'
          : '#e3f2fd',
      position: 'relative',
      boxShadow: isMaster
        ? '0 0 16px #1976d2'
        : outOfSync
          ? '0 0 10px #e53935'
          : '0 0 6px #90caf9'
    }}>
      <h3 style={{
        marginBottom: '0.2em',
        color: isMaster ? '#fff' : '#1565c0',
        letterSpacing: '1px'
      }}>
        {name} {isMaster && <span style={{
          background: '#fff',
          color: '#1976d2',
          borderRadius: '6px',
          fontSize: '0.8em',
          padding: '0.1em 0.5em',
          marginLeft: '0.5em',
          fontWeight: 700
        }}>MASTER</span>}
      </h3>
      <p style={{
        fontFamily: 'monospace',
        fontSize: '1.4em',
        margin: 0,
        color: isMaster ? '#fff' : '#000'
      }}>
        {new Date(displayTime).toLocaleTimeString()}
      </p>
      {/* Only show out-of-sync warning for slave partitions */}
      {!isMaster && outOfSync && (
        <div style={{
          color: '#b71c1c',
          fontWeight: 'bold',
          margin: '0.7em 0 0.5em 0',
          fontSize: '1.1em',
          borderTop: '2px solid #e53935',
          paddingTop: '0.4em'
        }}>
          ⚠️ Out of Sync with Master!
        </div>
      )}
      {!isMaster && (
        <>
          <button
            onClick={handleSimulateDrift}
            style={{
              margin: '0.2em',
              background: '#ff9800',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              padding: '0.4em 1em',
              fontWeight: 'bold',
              fontSize: '1em',
              cursor: 'pointer'
            }}
          >
            Simulate Large Drift
          </button>
          <button
            onClick={handleSyncNow}
            style={{
              margin: '0.2em',
              background: '#43a047',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              padding: '0.4em 1em',
              fontWeight: 'bold',
              fontSize: '1em',
              cursor: 'pointer'
            }}
          >
            Shared Memory Sync (timedatectl)
          </button>
        </>
      )}
    </div>
  );
});

export default PartitionClock;
