/**
 * 批量创建核应急领域数据集项目
 *
 * 使用方法：
 * 1. 确保开发服务器正在运行 (pnpm dev)
 * 2. 运行此脚本: node scripts/create-nuclear-emergency-projects.js
 */

const BASE_URL = process.env.API_URL || 'http://localhost:1717';

// 8个核应急数据集项目定义
const projects = [
  {
    name: '核应急基础理论',
    description: '核应急领域的基本概念、原理与分类体系。包括：核应急定义与本质属性、应急照射情况概念、纵深防御体系（五道防线）、正当性与最优化原则、威胁类别划分（I-V类）、应急状态四级分类、核应急与辐射应急的关系等基础理论知识。'
  },
  {
    name: '核应急法规标准',
    description: '核应急相关法律法规、国际公约、技术标准的解读。包括：《核安全法》应急章节、《核电厂核事故应急管理条例》、《国家核应急预案》、IAEA GSR Part 7、《及早通报核事故公约》、《核事故或辐射紧急情况援助公约》、国家标准（GB系列）与行业标准（EJ系列）等。'
  },
  {
    name: '核应急技术操作',
    description: '核应急响应中的监测、防护、救援、去污等技术方法。包括：辐射监测技术（固定站/流动监测/航空监测/海洋监测）、源项估算与大气扩散模拟、公众防护措施（隐蔽、撤离、服碘、食物控制）、去污洗消技术、医学救援程序、应急通信系统、决策支持系统应用等。'
  },
  {
    name: '核应急管理体系',
    description: '核应急的组织架构、预案体系、响应流程与恢复管理。包括：三级应急组织体系（国家-地方-营运单位）、国家核应急协调委员会职能、预案体系、应急响应流程与时间节点、军民融合与力量协同、应急终止条件与程序、恢复期管理等。'
  },
  {
    name: '核应急案例分析',
    description: '历史核事故案例、应急演习经验、事故教训分析。包括：三里岛核事故（1979）、切尔诺贝利核事故（1986）、福岛核事故（2011）、戈亚尼亚放射源事故（1987）、国内外重大辐射事故案例、应急演习案例与经验总结等。'
  },
  {
    name: '核应急公众科普',
    description: '面向普通公众的辐射知识、防护常识、心理疏导。包括：辐射基础知识（辐射类型、单位、天然本底）、核电站安全常识、核事故时的自我保护、碘片服用指南、食品安全与放射性污染、谣言辨别与心理疏导、核应急信息获取渠道等。'
  },
  {
    name: '核应急医学救援',
    description: '辐射损伤诊疗、医学应急响应专业知识。包括：急性辐射综合征（ARS）诊断与治疗、辐射损伤分级（造血型、肠型、脑型）、放射性核素内污染处理、医学应急响应程序、分级救治体系、专业医疗队伍建设、辐射医学救治基地等。'
  },
  {
    name: '核应急国际规范',
    description: 'IAEA标准、国际公约、中外核应急体系比较。包括：IAEA安全标准体系、国际核应急公约、各国应急级别划分差异、预案体制机制比较、公众沟通模式差异、国际演习与经验交流、跨境核事故协调机制等。'
  }
];

async function createProject(project) {
  try {
    const response = await fetch(`${BASE_URL}/api/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`HTTP ${response.status}: ${errorData.error || response.statusText}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('========================================');
  console.log('  核应急领域数据集项目批量创建工具');
  console.log('========================================\n');
  console.log(`API 地址: ${BASE_URL}`);
  console.log(`计划创建 ${projects.length} 个项目\n`);

  const results = {
    success: [],
    failed: []
  };

  for (let i = 0; i < projects.length; i++) {
    const project = projects[i];
    console.log(`[${i + 1}/${projects.length}] 正在创建: ${project.name}`);

    const result = await createProject(project);

    if (result.success) {
      console.log(`    ✓ 创建成功 (ID: ${result.data.id})`);
      results.success.push({ name: project.name, id: result.data.id });
    } else {
      console.log(`    ✗ 创建失败: ${result.error}`);
      results.failed.push({ name: project.name, error: result.error });
    }
  }

  // 打印汇总
  console.log('\n========================================');
  console.log('  创建结果汇总');
  console.log('========================================');
  console.log(`成功: ${results.success.length} 个`);
  console.log(`失败: ${results.failed.length} 个`);

  if (results.success.length > 0) {
    console.log('\n已创建的项目:');
    results.success.forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.name} (ID: ${p.id})`);
    });
  }

  if (results.failed.length > 0) {
    console.log('\n创建失败的项目:');
    results.failed.forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.name}`);
      console.log(`     原因: ${p.error}`);
    });
  }

  console.log('\n========================================');

  // 返回退出码
  process.exit(results.failed.length > 0 ? 1 : 0);
}

main();
