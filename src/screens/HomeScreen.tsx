import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Article } from '../types';
import { formatTime, formatNumber, truncateText } from '../utils';
import StorageService from '../services/StorageService';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 30) / 2;

const HomeScreen: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const storageService = StorageService.getInstance();

  const loadArticles = async () => {
    try {
      const articlesData = await storageService.getArticles();
      setArticles(articlesData);
    } catch (error) {
      console.error('加载文章失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadArticles();
    setRefreshing(false);
  };

  const handleLike = async (articleId: string) => {
    try {
      await storageService.likeArticle(articleId);
      const updatedArticles = articles.map(article =>
        article.id === articleId
          ? { ...article, likes: article.likes + 1 }
          : article
      );
      setArticles(updatedArticles);
    } catch (error) {
      console.error('点赞失败:', error);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const renderArticleItem = ({ item }: { item: Article }) => (
    <View style={styles.articleCard}>
      <Image
        source={{ uri: item.image }}
        style={styles.articleImage}
        resizeMode="cover"
      />
      <View style={styles.articleContent}>
        <Text style={styles.articleTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.articleDescription} numberOfLines={3}>
          {truncateText(item.content, 80)}
        </Text>
        <View style={styles.articleFooter}>
          <View style={styles.authorInfo}>
            <Image
              source={{ uri: item.author.avatar }}
              style={styles.authorAvatar}
            />
            <Text style={styles.authorName}>{item.author.name}</Text>
          </View>
          <Text style={styles.timeText}>{formatTime(item.createdAt)}</Text>
        </View>
        <View style={styles.articleActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleLike(item.id)}
          >
            <Icon name="favorite-border" size={16} color="#ff4757" />
            <Text style={styles.actionText}>{formatNumber(item.likes)}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="comment" size={16} color="#666" />
            <Text style={styles.actionText}>{item.comments.length}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>加载中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>首页</Text>
        <TouchableOpacity onPress={handleRefresh}>
          <Icon name="refresh" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={articles}
        renderItem={renderArticleItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  listContainer: {
    padding: 8,
  },
  articleCard: {
    width: ITEM_WIDTH,
    backgroundColor: '#fff',
    margin: 4,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  articleImage: {
    width: '100%',
    height: 120,
  },
  articleContent: {
    padding: 12,
  },
  articleTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  articleDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
    marginBottom: 12,
  },
  articleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  authorAvatar: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 4,
  },
  authorName: {
    fontSize: 10,
    color: '#666',
    flex: 1,
  },
  timeText: {
    fontSize: 10,
    color: '#999',
  },
  articleActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    flex: 1,
    marginHorizontal: 2,
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});

export default HomeScreen;