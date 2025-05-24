'use client';
import { useRef, useState } from 'react';
import PartitionClock from '../components/PartitionClock';

export default function Home() {
  const windowsRef = useRef();
  const linuxRef = useRef();
  const ubuntuRef = useRef();

  // Track out-of-sync status for Windows and Ubuntu
  const [syncStatuses, setSyncStatuses] = useState([false, false]);
  const updateSyncStatus = (idx, status) => {
    setSyncStatuses(prev => {
      const next = [...prev];
      next[idx] = status;
      return next;
    });
  };

  // Sync all non-master partitions
  const handleSyncAll = () => {
    windowsRef.current?.syncNow();
    ubuntuRef.current?.syncNow();
  };

  return (
    <main style={{ padding: '2em', fontFamily: 'Segoe UI, Arial, sans-serif', background: '#f4f8fb', minHeight: '100vh' }}>
      <div style={{
        background: 'linear-gradient(90deg, #1976d2 60%, #90caf9 100%)',
        color: '#fff',
        borderRadius: '12px',
        padding: '2em 1.5em 1.5em 1.5em',
        marginBottom: '2em',
        boxShadow: '0 4px 24pxrgba(17, 20, 23, 0.19)'
      }}>
        <h1 style={{ fontWeight: 700, fontSize: '2.2em', margin: 0, letterSpacing: '1px' }}>
          🕒 Real-Time Clock Partition Simulator
        </h1>
        <p style={{ fontSize: '1.15em', marginTop: '1em', lineHeight: 1.7 }}>
          <b>Master-Slave RTC Synchronization:</b> <br />
          <span style={{ color: '#ffe082' }}>Linux</span> acts as the <b>Master Partition</b>, reading the reference time from the hardware clock.<br />
          <span style={{ color: '#ffd54f' }}>Windows OS</span> and <span style={{ color: '#ffd54f' }}>Ubuntu</span> are <b>Slave Partitions</b> whose clocks may drift over time.<br />
          <b>Drift:</b> Slave clocks can become out of sync with the master.<br />
          <b>Manual Sync:</b> Use the <span style={{ color: '#43a047', fontWeight: 600 }}>Manual Sync</span> button on each slave or the <span style={{ color: '#000', fontWeight: 600 }}>Sync All</span> button below to instantly synchronize all slave clocks to the master (simulating <code>timedatectl set-local-rtc 1</code>).
        </p>
      </div>
      <div style={{ display: 'flex', gap: '2em', justifyContent: 'center', flexWrap: 'wrap' }}>
        <PartitionClock
          ref={windowsRef}
          name="Windows OS"
          isMaster={false}
          onSyncStatus={status => updateSyncStatus(0, status)}
        />
        <PartitionClock
          ref={linuxRef}
          name="Linux"
          isMaster={true}
        />
        <PartitionClock
          ref={ubuntuRef}
          name="Ubuntu"
          isMaster={false}
          onSyncStatus={status => updateSyncStatus(1, status)}
        />
      </div>
      {(syncStatuses[0] || syncStatuses[1]) && (
        <div style={{
          marginTop: '2em',
          color: '#b71c1c',
          background: '#ffebee',
          border: '2px solid #e53935',
          borderRadius: '8px',
          padding: '1em',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '1.2em',
          boxShadow: '0 2px 8px #e5393530'
        }}>
          ⚠️ One or more slave partitions are out of sync with the master (Linux)!
        </div>
      )}
      <div style={{ textAlign: 'center', marginTop: '1.5em' }}>
        <button
          onClick={handleSyncAll}
          style={{
            background: '#1976d2',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '0.7em 2em',
            fontWeight: 'bold',
            fontSize: '1.1em',
            cursor: 'pointer',
            boxShadow: '0 2px 8px #1976d230'
          }}
        >
          Sync All Slave Partitions (timedatectl)
        </button>
      </div>
    </main>
  );
}