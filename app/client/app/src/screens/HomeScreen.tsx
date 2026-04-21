import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import {
  listMemberships,
  mapMobileIamError,
  updateMembershipRole,
  updateMembershipStatus,
  type TenantMembership
} from '../services/iamApi';

export default function HomeScreen() {
  const [tenantId, setTenantId] = React.useState<'tenant-001' | 'tenant-002'>('tenant-001');
  const [actorUserId, setActorUserId] = React.useState('owner-001');
  const [memberships, setMemberships] = React.useState<TenantMembership[]>([]);
  const [stateMessage, setStateMessage] = React.useState('Loading memberships...');
  const [isMutating, setIsMutating] = React.useState(false);

  const refreshMemberships = React.useCallback(async () => {
    setStateMessage('Loading memberships...');
    try {
      const payload = await listMemberships({ tenantId, actorUserId });
      setMemberships(payload.items);
      setStateMessage(`Loaded memberships: ${payload.total}`);
    } catch (error) {
      setStateMessage(mapMobileIamError(error));
      setMemberships([]);
    }
  }, [tenantId, actorUserId]);

  React.useEffect(() => {
    void refreshMemberships();
  }, [refreshMemberships]);

  async function suspendMembership(userId: string): Promise<void> {
    setIsMutating(true);
    try {
      await updateMembershipStatus({
        tenantId,
        actorUserId,
        userId,
        status: 'Suspended'
      });
      await refreshMemberships();
    } catch (error) {
      setStateMessage(mapMobileIamError(error));
    } finally {
      setIsMutating(false);
    }
  }

  async function setViewerRole(userId: string): Promise<void> {
    setIsMutating(true);
    try {
      await updateMembershipRole({
        tenantId,
        actorUserId,
        userId,
        role: 'Viewer'
      });
      await refreshMemberships();
    } catch (error) {
      setStateMessage(mapMobileIamError(error));
    } finally {
      setIsMutating(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Tenant IAM Console</Text>
        <Text style={styles.subtitle}>React Native client baseline for FEAT-0002</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tenant Context</Text>
          <Text style={styles.description}>Switch active tenant context (mirrors web behavior).</Text>
          <View style={styles.row}>
            <ChoiceButton
              active={tenantId === 'tenant-001'}
              label="tenant-001"
              onPress={() => setTenantId('tenant-001')}
            />
            <ChoiceButton
              active={tenantId === 'tenant-002'}
              label="tenant-002"
              onPress={() => setTenantId('tenant-002')}
            />
          </View>
          <Text style={styles.description}>Select actor identity used for API requests.</Text>
          <View style={styles.row}>
            {['owner-001', 'member-001', 'disabled-001', 'owner-002'].map((actor) => (
              <ChoiceButton
                key={actor}
                active={actorUserId === actor}
                label={actor}
                onPress={() => setActorUserId(actor)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Memberships</Text>
          <Text style={styles.description}>{stateMessage}</Text>
          {memberships.map((membership) => (
            <View key={`${membership.tenantId}:${membership.userId}`} style={styles.membershipCard}>
              <Text style={styles.featureText}>User: {membership.userId}</Text>
              <Text style={styles.featureText}>Role: {membership.role}</Text>
              <Text style={styles.featureText}>Status: {membership.status}</Text>
              <Pressable
                disabled={isMutating}
                style={styles.actionButton}
                onPress={() => setViewerRole(membership.userId)}
              >
                <Text style={styles.actionButtonText}>Set Viewer</Text>
              </Pressable>
              <Pressable
                disabled={isMutating}
                style={styles.actionButton}
                onPress={() => suspendMembership(membership.userId)}
              >
                <Text style={styles.actionButtonText}>Suspend</Text>
              </Pressable>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Deterministic Error Semantics</Text>
          <FeatureItem text="403 is rendered as forbidden/global block message" />
          <FeatureItem text="409 is rendered as conflict/invariant message" />
          <FeatureItem text="Client never resolves authorization locally" />
        </View>
      </View>
    </ScrollView>
  );
}

interface ChoiceButtonProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

function ChoiceButton({ label, active, onPress }: ChoiceButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.choiceButton, active ? styles.choiceButtonActive : undefined]}
    >
      <Text style={[styles.choiceButtonText, active ? styles.choiceButtonTextActive : undefined]}>
        {label}
      </Text>
    </Pressable>
  );
}

interface FeatureItemProps {
  text: string;
}

function FeatureItem({ text }: FeatureItemProps) {
  return (
    <View style={styles.featureItem}>
      <Text style={styles.bullet}>✓</Text>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingVertical: 20,
  },
  content: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 8,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  bullet: {
    fontSize: 16,
    color: '#4CAF50',
    marginRight: 12,
    fontWeight: 'bold',
  },
  featureText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  choiceButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  choiceButtonActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  choiceButtonText: {
    color: '#111827',
    fontSize: 12,
  },
  choiceButtonTextActive: {
    color: '#fff',
  },
  membershipCard: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    gap: 4,
  },
  actionButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#1f2937',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 4,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  footer: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});
