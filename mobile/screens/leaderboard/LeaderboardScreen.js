import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Image,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    RefreshControl
} from 'react-native';
import leaderboardService from '../../service/leaderboardService';
import theme from '../../theme/theme';

const LeaderboardScreen = () => {
    const [leaderboards, setLeaderboards] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeType, setActiveType] = useState('total_score');
    const [refreshing, setRefreshing] = useState(false);

    const navigationItems = [
        { id: 'total_score', label: 'Total Score', icon: '🏆' },
        { id: 'relapse_free_streak', label: 'Relapse-Free', icon: '🔥' },
        { id: 'community_support', label: 'Community', icon: '👥' },
    ];

    const fetchLeaderboard = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await leaderboardService.getLeaderboard();
            let lb = {};
            if (data && typeof data === 'object') {
                lb = data.data || data;
            }
            setLeaderboards(lb);
            if (lb && !lb[activeType] && navigationItems.length > 0) {
                setActiveType(navigationItems[0].id);
            }
        } catch (err) {
            setError('Failed to load leaderboard.');
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchLeaderboard();
        setRefreshing(false);
    };

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const renderRankIcon = (rank) => {
        if (!rank) return null;
        switch (rank) {
            case 1:
                return (
                    <Image
                        source={{ uri: 'https://smk-cessation-bucket.s3.us-east-1.amazonaws.com/icons/icons8-first-place-ribbon-64-zq79sb21lipd9sjibdi2t7kws.png' }}
                        style={styles.medalIcon}
                    />
                );
            case 2:
                return (
                    <Image
                        source={{ uri: 'https://smk-cessation-bucket.s3.us-east-1.amazonaws.com/icons/icons8-second-place-ribbon-64-cyj2xco1hq7vdnxvme8rb12nk.png' }}
                        style={styles.medalIcon}
                    />
                );
            case 3:
                return (
                    <Image
                        source={{ uri: 'https://smk-cessation-bucket.s3.us-east-1.amazonaws.com/icons/icons8-third-place-ribbon-64-hoszh14mxnufi8zxsgz0q36xr.png' }}
                        style={styles.medalIcon}
                    />
                );
            default:
                return <Text style={styles.rankText}>{rank}</Text>;
        }
    };

    const currentEntries = (leaderboards[activeType] || []).sort((a, b) => (a.rank || 0) - (b.rank || 0));

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />
            
            <View style={styles.header}>
                <Text style={styles.headerText}>Leaderboards</Text>
            </View>

            {/* Navigation Tabs */}
            <View style={styles.tabsContainer}>
                {navigationItems.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={[
                            styles.tabButton,
                            activeType === item.id && styles.activeTabButton
                        ]}
                        onPress={() => setActiveType(item.id)}
                    >
                        <View style={styles.tabContent}>
                            <Text style={styles.tabIcon}>{item.icon}</Text>
                            <Text style={[
                                styles.tabText,
                                activeType === item.id && styles.activeTabText
                            ]}>
                                {item.label}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            {loading && !refreshing ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            ) : error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : (
                <ScrollView
                    style={styles.contentContainer}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[theme.colors.primary]}
                        />
                    }
                >
                    {currentEntries?.length > 0 ? currentEntries.map((entry) => (
                        <View key={entry.id} style={[
                            styles.rankItem,
                            entry.rank <= 3 && styles.topRankItem
                        ]}>
                            <View style={styles.rankNumber}>
                                {renderRankIcon(entry.rank)}
                            </View>
                            <View style={styles.userInfo}>
                                <Image
                                    source={entry.avatar ? { uri: entry.avatar } : require('../../assets/icon.png')}
                                    style={styles.avatar}
                                />
                                <View style={styles.userInfoText}>
                                    <Text style={styles.username}>
                                        {entry.first_name || ''} {entry.last_name || ''}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.scoreContainer}>
                                <Text style={styles.score}>{entry.score ?? 0}</Text>
                                <Text style={styles.scoreLabel}>XP</Text>
                            </View>
                        </View>
                    )) : (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>No data available.</Text>
                        </View>
                    )}
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    tabButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 8,
        marginHorizontal: 4,
        borderRadius: 8,
        backgroundColor: '#f5f5f5',
    },
    activeTabButton: {
        backgroundColor: theme.colors.primary,
    },
    tabContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabIcon: {
        fontSize: 16,
        marginRight: 6,
    },
    tabText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#666',
    },
    activeTabText: {
        color: '#fff',
    },
    contentContainer: {
        flex: 1,
        padding: 12,
    },
    rankItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#fff',
        marginBottom: 8,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    topRankItem: {
        backgroundColor: '#fff',
        elevation: 4,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    rankNumber: {
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    medalIcon: {
        width: 30,
        height: 30,
    },
    rankText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#666',
    },
    userInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
        borderWidth: 1,
        borderColor: '#eee',
    },
    userInfoText: {
        flex: 1,
    },
    username: {
        fontSize: 15,
        fontWeight: '600',
        color: '#000',
    },
    scoreContainer: {
        alignItems: 'center',
    },
    score: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    scoreLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    errorContainer: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    errorText: {
        color: '#666',
        fontSize: 14,
        textAlign: 'center',
    },
});

export default LeaderboardScreen;
