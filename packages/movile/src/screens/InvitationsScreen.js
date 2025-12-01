<<<<<<< HEAD:packages/carpeta/src/screens/InvitationsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import {  acceptInvitation, rejectInvitation } from '../api_Gamblers';
import {listarInvitaciones} from '../api_Managers';
import { styles } from '../ui/Styles'; 
=======
import { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { acceptInvitation, getInvitations, rejectInvitation } from '../api';
import { styles } from '../ui/Styles';
>>>>>>> 46319f3e3c0dfa165b944232827ed78115ae6693:packages/movile/src/screens/InvitationsScreen.js

export default function InvitationsScreen() {
  const [invitations, setInvitations] = useState([]);
  const [loadingIds, setLoadingIds] = useState([]);

  const load = async () => {
    try {
      const data = await listarInvitaciones();
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
