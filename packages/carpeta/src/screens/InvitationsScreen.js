import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { getInvitations, acceptInvitation, rejectInvitation } from '../api';

export default function InvitationsScreen() {
  const [invitations, setInvitations] = useState([]);
  const [loadingIds, setLoadingIds] = useState([]);

  const load = async () => {
    try {
      const data = await getInvitations();
      setInvitations(data || []);
    } catch (e) {
      console.error('Error cargando invitaciones', e);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAccept = async (id) => {
    try {
      setLoadingIds(prev => [...prev, id]);
      await acceptInvitation(id);
      await load();
    } catch (e) {
      console.error('Error aceptando invitación', e);
    } finally {
      setLoadingIds(prev => prev.filter(x => x !== id));
    }
  };

  const handleReject = async (id) => {
    try {
      setLoadingIds(prev => [...prev, id]);
      await rejectInvitation(id);
      await load();
    } catch (e) {
      console.error('Error rechazando invitación', e);
    } finally {
      setLoadingIds(prev => prev.filter(x => x !== id));
    }
  };

  const renderItem = ({ item }) => {
    const pending = !item.acceptedAt && !item.revokedAt;
    const busy = loadingIds.includes(item.id);

    return (
      <View style={styles.card}>
        <Text style={styles.label}>Torneo: {item.tournament}</Text>
        <Text style={styles.info}>
          Invitado por: {item.invitingManager}
        </Text>
        {pending ? (
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.btn, styles.accept, busy && { opacity: 0.6 }]}
              onPress={() => handleAccept(item.id)}
              disabled={busy}
            >
              <Text style={styles.btnText}>Aceptar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.reject, busy && { opacity: 0.6 }]}
              onPress={() => handleReject(item.id)}
              disabled={busy}
            >
              <Text style={styles.btnText}>Rechazar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.status}>
            {item.acceptedAt
              ? '✅ Aceptada'
              : item.revokedAt
              ? '❌ Revocada'
              : 'Estado desconocido'}
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Invitaciones</Text>
      <Text style={styles.subtitle}>
        Aceptá o rechazá las invitaciones a torneos.
      </Text>

      <FlatList
        data={invitations}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 8 }}
        ListEmptyComponent={
          <Text style={styles.empty}>No tenés invitaciones pendientes.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#e5e7eb',
  },
  subtitle: {
    fontSize: 13,
    color: '#9ca3af',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  label: {
    fontSize: 13,
    color: '#e5e7eb',
  },
  info: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  btn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 999,
    alignItems: 'center',
  },
  accept: {
    backgroundColor: '#22c55e',
  },
  reject: {
    backgroundColor: '#f97373',
  },
  btnText: {
    color: '#0b1120',
    fontWeight: '600',
    fontSize: 13,
  },
  status: {
    marginTop: 8,
    fontSize: 13,
    color: '#9ca3af',
  },
  empty: {
    color: '#9ca3af',
    marginTop: 40,
    textAlign: 'center',
  },
});