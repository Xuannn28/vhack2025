import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  SafeAreaView,
  Dimensions,
  Animated,
  Vibration
} from 'react-native';

const HealthRewardsScreen = () => {
  const [healthPoints, setHealthPoints] = useState(3250);
  const [level, setLevel] = useState(5);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [dailyStreak, setDailyStreak] = useState(7);
  const [selectedTab, setSelectedTab] = useState('rewards');
  const [pulseAnimation] = useState(new Animated.Value(1));

  // Animation for pulse effect
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Simulate gaining points (for demo purposes)
  const earnPoints = (amount) => {
    setHealthPoints(prev => {
      const newPoints = prev + amount;
      // Check if level up condition met (every 1000 points)
      if (Math.floor(newPoints / 1000) > Math.floor(prev / 1000)) {
        triggerLevelUp();
      }
      return newPoints;
    });
    // Vibration feedback
    Vibration.vibrate(100);
  };

  const triggerLevelUp = () => {
    setLevel(prev => prev + 1);
    setShowLevelUp(true);
    setTimeout(() => setShowLevelUp(false), 3000);
  };

  const redeemReward = (rewardId, pointsCost) => {
    if (healthPoints >= pointsCost) {
      setHealthPoints(prev => prev - pointsCost);
      // Vibration pattern for reward redeem
      Vibration.vibrate([0, 70, 50, 70]);
      console.log(`Reward ${rewardId} redeemed`);
      // Here you would handle the actual reward redemption logic
    }
  };

  const weeklyData = [
    { day: "Mon", points: 125, steps: 6500 },
    { day: "Tue", points: 250, steps: 8200 },
    { day: "Wed", points: 500, steps: 12000 },
    { day: "Thu", points: 650, steps: 15000 },
    { day: "Fri", points: 425, steps: 9800 },
    { day: "Sat", points: 800, steps: 18000 },
    { day: "Sun", points: 500, steps: 11000 }
  ];

  const maxPoints = Math.max(...weeklyData.map(item => item.points));

  const rewards = [
    { 
      id: 1, 
      title: '20% Off Protein Supplements', 
      points: 1000,
      description: 'Get a discount on your next supplement purchase',
      rarity: 'common',
      icon: '🥤'
    },
    { 
      id: 2, 
      title: '$15 Wellness Store Voucher', 
      points: 2500,
      description: 'Use this voucher on any wellness product',
      rarity: 'rare',
      icon: '🎫'
    },
    { 
      id: 3, 
      title: 'Free Yoga Class', 
      points: 3000,
      description: 'One complimentary yoga session',
      rarity: 'epic',
      icon: '🧘'
    },
    { 
      id: 4, 
      title: 'Premium Vitamin Bundle', 
      points: 4500,
      description: 'A month supply of essential vitamins',
      rarity: 'legendary',
      icon: '💊'
    },
  ];

  const dailyChallenges = [
    { 
      id: 1, 
      title: '10,000 Steps', 
      progress: 85, 
      reward: 100,
      icon: '👣'
    },
    { 
      id: 2, 
      title: '8 Hours Sleep', 
      progress: 70, 
      reward: 150,
      icon: '😴'
    },
    { 
      id: 3, 
      title: '30 Mins Heart Rate Zone', 
      progress: 60, 
      reward: 200,
      icon: '❤️'
    },
    { 
      id: 4, 
      title: 'Meditate for 10 mins', 
      progress: 100, 
      reward: 50,
      completed: true,
      icon: '🧠'
    },
  ];

  const renderChallengeItem = (item) => (
    <TouchableOpacity 
      key={item.id} 
      style={styles.challengeItem}
      onPress={() => !item.completed && earnPoints(Math.floor(item.reward * (item.progress/100)))}
    >
      <View style={styles.challengeIconContainer}>
        <Text style={styles.challengeIcon}>{item.icon}</Text>
      </View>
      <View style={styles.challengeContent}>
        <View style={styles.challengeHeader}>
          <Text style={styles.challengeTitle}>{item.title}</Text>
          <Text style={styles.challengeReward}>+{item.reward} pts</Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View 
            style={[
              styles.progressBar, 
              { width: `${item.progress}%` },
              item.completed ? styles.progressCompleted : null
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {item.completed ? "COMPLETED!" : `${item.progress}% complete`}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const getRarityColor = (rarity) => {
    switch(rarity) {
      case 'common': return '#78909c';
      case 'rare': return '#5c6bc0';
      case 'epic': return '#8e24aa';
      case 'legendary': return '#f9a825';
      default: return '#78909c';
    }
  };

  const renderRewardItem = (item) => (
    <TouchableOpacity 
      key={item.id} 
      style={[styles.rewardCard, healthPoints >= item.points ? styles.rewardAvailable : styles.rewardLocked]}
      onPress={() => redeemReward(item.id, item.points)}
      activeOpacity={healthPoints >= item.points ? 0.6 : 1}
    >
      <View style={[styles.rewardIconContainer, { backgroundColor: getRarityColor(item.rarity) }]}>
        <Text style={styles.rewardIconText}>{item.icon}</Text>
        <View style={styles.rarityBadge}>
          <Text style={styles.rarityText}>{item.rarity}</Text>
        </View>
      </View>
      <View style={styles.rewardInfo}>
        <Text style={styles.rewardTitle}>{item.title}</Text>
        <Text style={styles.rewardDescription}>{item.description}</Text>
        <View style={styles.pointsContainer}>
          <Text style={styles.pointsText}>🏆 {item.points} points</Text>
        </View>
      </View>
      <View style={[
        styles.redeemButton, 
        { opacity: healthPoints >= item.points ? 1 : 0.5 }
      ]}>
        <Text style={styles.redeemText}>
          {healthPoints >= item.points ? 'Claim' : 'Locked'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderBarChart = () => (
    <View style={styles.chartContainer}>
      <View style={styles.barContainer}>
        {weeklyData.map((data, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.barWrapper}
            onPress={() => earnPoints(25)}
          >
            <View style={styles.barValueContainer}>
              <Text style={styles.barValue}>{data.points}</Text>
            </View>
            <View style={[
              styles.bar, 
              { height: (data.points / maxPoints) * 120 },
              new Date().getDay() === index ? styles.activeBar : null
            ]} />
            <Text style={[
              styles.barLabel,
              new Date().getDay() === index ? styles.activeBarLabel : null
            ]}>{data.day}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  // Progress to next level
  const levelProgress = (healthPoints % 1000) / 10; // 0-100%
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Level up celebration overlay */}
      {showLevelUp && (
        <View style={styles.levelUpOverlay}>
          <Animated.View 
            style={[
              styles.levelUpCard,
              {transform: [{scale: pulseAnimation}]}
            ]}
          >
            <Text style={styles.levelUpText}>LEVEL UP!</Text>
            <Text style={styles.newLevelText}>Level {level}</Text>
            <Text style={styles.levelUpReward}>+500 Bonus Points!</Text>
          </Animated.View>
        </View>
      )}
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.profileSection}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>{level}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.greeting}>Health Quest</Text>
              <View style={styles.streakContainer}>
                <Text style={styles.streakText}>🔥 {dailyStreak} day streak</Text>
              </View>
            </View>
          </View>
          <View style={styles.pointsBadge}>
            <TouchableOpacity onPress={() => earnPoints(50)}>
              <Text style={styles.pointsValue}>🏆 {healthPoints}</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Level progress bar */}
        <View style={styles.levelProgressContainer}>
          <View style={[styles.levelProgressBar, { width: `${levelProgress}%` }]} />
          <Text style={styles.levelProgressText}>Level {level} • {levelProgress.toFixed(0)}% to Level {level+1}</Text>
        </View>
      </View>
      
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'challenges' && styles.activeTab]} 
          onPress={() => setSelectedTab('challenges')}
        >
          <Text style={[styles.tabText, selectedTab === 'challenges' && styles.activeTabText]}>Daily Quests</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'rewards' && styles.activeTab]} 
          onPress={() => setSelectedTab('rewards')}
        >
          <Text style={[styles.tabText, selectedTab === 'rewards' && styles.activeTabText]}>Rewards Shop</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'stats' && styles.activeTab]} 
          onPress={() => setSelectedTab('stats')}
        >
          <Text style={[styles.tabText, selectedTab === 'stats' && styles.activeTabText]}>Stats</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        {selectedTab === 'challenges' && (
          <>
            <Text style={styles.sectionTitle}>Daily Health Quests</Text>
            <Text style={styles.sectionSubtitle}>Complete quests to earn points!</Text>
            {dailyChallenges.map(renderChallengeItem)}
          </>
        )}
        
        {selectedTab === 'rewards' && (
          <>
            <Text style={styles.sectionTitle}>Rewards Shop</Text>
            <Text style={styles.sectionSubtitle}>Redeem your points for real rewards</Text>
            {rewards.map(renderRewardItem)}
          </>
        )}
        
        {selectedTab === 'stats' && (
          <>
            <Text style={styles.sectionTitle}>Your Weekly Activity</Text>
            <Text style={styles.sectionSubtitle}>Tap on bars to refresh stats</Text>
            <View style={styles.statsCard}>
              {renderBarChart()}
              
              {/* Quick Stats */}
              <View style={styles.quickStats}>
                <TouchableOpacity style={styles.statItem} onPress={() => earnPoints(25)}>
                  <Text style={styles.statEmoji}>❤️</Text>
                  <Text style={styles.statValue}>68 bpm</Text>
                  <Text style={styles.statLabel}>Avg HR</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.statItem} onPress={() => earnPoints(25)}>
                  <Text style={styles.statEmoji}>😴</Text>
                  <Text style={styles.statValue}>7.5 hrs</Text>
                  <Text style={styles.statLabel}>Sleep</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.statItem} onPress={() => earnPoints(25)}>
                  <Text style={styles.statEmoji}>👣</Text>
                  <Text style={styles.statValue}>11,432</Text>
                  <Text style={styles.statLabel}>Steps</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Achievement badges */}
            <Text style={styles.sectionTitle}>Achievement Badges</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgeScrollView}>
              <View style={styles.badgeContainer}>
                <View style={[styles.badge, styles.badgeUnlocked]}>
                  <Text style={styles.badgeEmoji}>🥇</Text>
                </View>
                <Text style={styles.badgeText}>Step Master</Text>
              </View>
              <View style={styles.badgeContainer}>
                <View style={[styles.badge, styles.badgeUnlocked]}>
                  <Text style={styles.badgeEmoji}>💤</Text>
                </View>
                <Text style={styles.badgeText}>Sleep King</Text>
              </View>
              <View style={styles.badgeContainer}>
                <View style={[styles.badge, styles.badgeUnlocked]}>
                  <Text style={styles.badgeEmoji}>🔥</Text>
                </View>
                <Text style={styles.badgeText}>7-Day Streak</Text>
              </View>
              <View style={styles.badgeContainer}>
                <View style={[styles.badge, styles.badgeLocked]}>
                  <Text style={styles.badgeEmoji}>🏃</Text>
                </View>
                <Text style={styles.badgeText}>Marathon</Text>
              </View>
              <View style={styles.badgeContainer}>
                <View style={[styles.badge, styles.badgeLocked]}>
                  <Text style={styles.badgeEmoji}>🧘</Text>
                </View>
                <Text style={styles.badgeText}>Zen Master</Text>
              </View>
            </ScrollView>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f0f3',
  },
  header: {
    backgroundColor: '#2c3e50',
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelBadge: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#e84393',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fd79a8',
  },
  levelText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userInfo: {
    marginLeft: 10,
  },
  greeting: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  streakText: {
    color: '#ecf0f1',
    fontSize: 14,
  },
  pointsBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsValue: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  levelProgressContainer: {
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 6,
    marginTop: 10,
    overflow: 'hidden',
  },
  levelProgressBar: {
    height: '100%',
    backgroundColor: '#3498db',
    borderRadius: 6,
  },
  levelProgressText: {
    color: '#fff',
    fontSize: 10,
    textAlign: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: -1,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 25,
    margin: 16,
    padding: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 25,
  },
  activeTab: {
    backgroundColor: '#3498db',
  },
  tabText: {
    color: '#7f8c8d',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 16,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 16,
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  chartContainer: {
    height: 180,
    marginBottom: 10,
  },
  barContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingBottom: 20,
  },
  barWrapper: {
    alignItems: 'center',
    width: 32,
  },
  barValueContainer: {
    marginBottom: 4,
  },
  barValue: {
    fontSize: 10,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  bar: {
    width: 24,
    backgroundColor: '#3498db',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    opacity: 0.7,
  },
  activeBar: {
    backgroundColor: '#e84393',
    opacity: 1,
    width: 28,
  },
  barLabel: {
    marginTop: 6,
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  activeBarLabel: {
    color: '#e84393',
    fontWeight: 'bold',
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  statEmoji: {
    fontSize: 28,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
    color: '#2c3e50',
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 2,
  },
  challengeItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    flexDirection: 'row',
    marginBottom: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  challengeIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  challengeIcon: {
    fontSize: 24,
  },
  challengeContent: {
    flex: 1,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  challengeReward: {
    fontSize: 14,
    fontWeight: '500',
    color: '#e84393',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#ecf0f1',
    borderRadius: 4,
    marginBottom: 6,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#3498db',
    borderRadius: 4,
  },
  progressCompleted: {
    backgroundColor: '#27ae60',
  },
  progressText: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'right',
  },
  rewardCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  rewardAvailable: {
    borderLeftWidth: 4,
    borderLeftColor: '#27ae60',
  },
  rewardLocked: {
    borderLeftWidth: 4,
    borderLeftColor: '#bdc3c7',
    opacity: 0.8,
  },
  rewardIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  rewardIconText: {
    fontSize: 28,
  },
  rarityBadge: {
    position: 'absolute',
    bottom: -5,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 10,
  },
  rarityText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  rewardInfo: {
    flex: 1,
    paddingHorizontal: 12,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 2,
  },
  rewardDescription: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsText: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '500',
  },
  redeemButton: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  redeemText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  badgeScrollView: {
    marginVertical: 10,
  },
  badgeContainer: {
    alignItems: 'center',
    marginRight: 16,
    width: 70,
  },
  badge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  badgeUnlocked: {
    backgroundColor: '#3498db',
    borderWidth: 2,
    borderColor: '#2980b9',
  },
  badgeLocked: {
    backgroundColor: '#bdc3c7',
    borderWidth: 2,
    borderColor: '#95a5a6',
  },
  badgeEmoji: {
    fontSize: 24,
  },
  badgeText: {
    fontSize: 12,
    color: '#2c3e50',
    textAlign: 'center',
  },
  levelUpOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  levelUpCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  levelUpText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e84393',
    marginBottom: 10,
  },
  newLevelText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  levelUpReward: {
    fontSize: 18,
    color: '#27ae60',
    fontWeight: '600',
  },
});

export default HealthRewardsScreen;