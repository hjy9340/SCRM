/**
 * 客户头像示例库
 * 提供预设的客户头像样例供快速选择
 */

// 头像示例库
const AvatarSamples = {
    // 常用头像集合
    common: [
        {
            name: '商务男士1',
            url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop',
            tags: ['男性', '商务', '正装']
        },
        {
            name: '商务女士1',
            url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop',
            tags: ['女性', '商务', '正装']
        },
        {
            name: '企业高管1',
            url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop',
            tags: ['男性', '高管', '商务']
        },
        {
            name: '企业高管2',
            url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop',
            tags: ['女性', '高管', '商务']
        },
        {
            name: '工程师1',
            url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
            tags: ['男性', '工程师', '专业']
        },
        {
            name: '工程师2',
            url: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=200&h=200&fit=crop',
            tags: ['女性', '工程师', '专业']
        },
        {
            name: '创业者1',
            url: 'https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?w=200&h=200&fit=crop',
            tags: ['男性', '创业', '商务']
        },
        {
            name: '创业者2',
            url: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=200&h=200&fit=crop',
            tags: ['女性', '创业', '商务']
        }
    ],
    
    // 按行业分类的头像
    industry: {
        '制造业': [
            {
                name: '制造业专家',
                url: 'https://images.unsplash.com/photo-1572983423767-fa0ff3bdc770?w=200&h=200&fit=crop',
                tags: ['男性', '专家', '制造']
            },
            {
                name: '工厂管理者',
                url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&h=200&fit=crop',
                tags: ['男性', '管理', '工厂']
            }
        ],
        '物流行业': [
            {
                name: '物流经理',
                url: 'https://images.unsplash.com/photo-1556157382-97eda2f9e2bf?w=200&h=200&fit=crop',
                tags: ['男性', '经理', '物流']
            },
            {
                name: '运输主管',
                url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&h=200&fit=crop',
                tags: ['男性', '主管', '运输']
            }
        ],
        '科技行业': [
            {
                name: '科技CEO',
                url: 'https://images.unsplash.com/photo-1541647376583-8934aaf3448a?w=200&h=200&fit=crop',
                tags: ['男性', 'CEO', '科技']
            },
            {
                name: '科技总监',
                url: 'https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=200&h=200&fit=crop',
                tags: ['女性', '总监', '科技']
            }
        ],
        '金融行业': [
            {
                name: '金融顾问',
                url: 'https://images.unsplash.com/photo-1542222024-c39e2281f121?w=200&h=200&fit=crop',
                tags: ['男性', '顾问', '金融']
            },
            {
                name: '投资经理',
                url: 'https://images.unsplash.com/photo-1589386417686-0d34b5903d23?w=200&h=200&fit=crop',
                tags: ['女性', '经理', '投资']
            }
        ],
        '地产行业': [
            {
                name: '地产开发商',
                url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
                tags: ['男性', '开发商', '地产']
            },
            {
                name: '房产投资人',
                url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop',
                tags: ['女性', '投资', '房产']
            }
        ]
    },
    
    // 根据指定条件获取示例头像
    getByIndustry: function(industry) {
        if (this.industry[industry]) {
            return this.industry[industry];
        }
        return this.common.slice(0, 4); // 默认返回通用头像
    },
    
    // 搜索头像
    search: function(keyword) {
        keyword = keyword.toLowerCase();
        
        let results = [];
        
        // 搜索通用头像
        results = results.concat(
            this.common.filter(avatar => 
                avatar.name.toLowerCase().includes(keyword) || 
                avatar.tags.some(tag => tag.toLowerCase().includes(keyword))
            )
        );
        
        // 搜索行业头像
        for (const industry in this.industry) {
            if (industry.toLowerCase().includes(keyword)) {
                results = results.concat(this.industry[industry]);
            } else {
                const industryResults = this.industry[industry].filter(avatar => 
                    avatar.name.toLowerCase().includes(keyword) || 
                    avatar.tags.some(tag => tag.toLowerCase().includes(keyword))
                );
                results = results.concat(industryResults);
            }
        }
        
        return results;
    },
    
    // 随机获取示例头像
    getRandom: function(count = 1) {
        const all = this.common.concat(
            Object.values(this.industry).flat()
        );
        
        const shuffled = all.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }
};

// 如果在浏览器环境中，将对象挂载到window上
if (typeof window !== 'undefined') {
    window.AvatarSamples = AvatarSamples;
}

// 如果在Node.js环境中，导出对象
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AvatarSamples;
}