
// 支持 DeepSeek 和通义千问的 AI 服务
// 懒加载实例，防止顶层初始化失败导致白屏

interface AIProvider {
  name: 'deepseek' | 'qwen' | 'local';
  apiKey?: string;
}

// 当前 AI 提供商配置（可通过环境变量切换）
const AI_PROVIDER: AIProvider = {
  name: (process.env.AI_PROVIDER as 'deepseek' | 'qwen' | 'local') || 'deepseek',
  apiKey: process.env.AI_API_KEY
};

// 本地知识库 - Offline Mode Support
const LOCAL_KNOWLEDGE_BASE: Record<string, string> = {
  '跳闸': '【智能诊断】跳闸通常是因为负载过大或电器短路。\n1. 请拔掉最近使用的电器插头。\n2. 尝试重新合闸。\n3. 如再次跳闸，请勿强行尝试，建议使用 App"一键检测"预约电工上门排查。',
  '冒烟': '【⚠️安全警告】发现冒烟请立即切断总电源！\n切勿触碰冒烟处，防止触电或引发火灾。这通常是线路老化或接触不良导致的过热。请立即在 App 中选择"电路急修"。',
  '火花': '【⚠️安全警告】插座冒火花说明内部接触不良或负载过高。\n请暂停使用该插座。建议更换新面板，费用约 50-80 元。',
  '灯': '灯具闪烁可能是电压不稳或灯泡老化。如果是 LED 灯，可能是驱动器故障。建议预约"灯具维修"。',
  '安装': '我们提供各类灯具、开关插座、浴霸的安装服务。收费标准透明，安装费 30 元起。',
  '价格': '我们的收费公开透明：\n上门费：30-50 元\n检修费：视难度而定（50 元起）\n材料费：实报实销\n您可以在"我的"页面查看详细价目表。',
  'default': '【智能客服】收到您的描述。根据经验，这可能是家庭电路常见的小故障。\n为了您的安全，建议不要带电操作。\n您可以点击底部的"地图"查看附近师傅，或使用"一键检测"功能。'
};

function getLocalResponse(text: string): string {
  const keyword = Object.keys(LOCAL_KNOWLEDGE_BASE).find(k => text.includes(k));
  return LOCAL_KNOWLEDGE_BASE[keyword || 'default'];
}

// 通用 AI 调用函数 - 支持 DeepSeek 和通义千问
const callAI = async (prompt: string, systemPrompt: string = ''): Promise<string> => {
  const { name, apiKey } = AI_PROVIDER;
  
  if (!apiKey) {
    console.warn(`AI API Key is missing for ${name}. Using local mode.`);
    return getLocalResponse(prompt);
  }

  try {
    if (name === 'deepseek') {
      // DeepSeek API 调用
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || getLocalResponse(prompt);
      
    } else if (name === 'qwen') {
      // 通义千问 API 调用
      const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'qwen-turbo',
          input: {
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: prompt }
            ]
          },
          parameters: {
            temperature: 0.7,
            max_tokens: 500
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Qwen API error: ${response.status}`);
      }

      const data = await response.json();
      return data.output?.text || getLocalResponse(prompt);
    }
    
    return getLocalResponse(prompt);
  } catch (error) {
    console.warn(`AI API failed (${name}), switching to local mode:`, error);
    return getLocalResponse(prompt);
  }
};

/**
 * 电路故障智能分析
 * @param description 故障描述
 * @returns AI 诊断结果
 */
export const analyzeElectricalIssue = async (description: string): Promise<string> => {
  const systemPrompt = `你是一个专业的电工 AI 助手，名叫"小安"。
用户遇到了一个电力问题，需要你提供专业的诊断建议。

请提供一个简明的 3 步建议：
1. 安全警告（如果有必要）。
2. 可能的原因。
3. 建议的服务类型（例如："电路维修"、"线路检查"、"电器安装"）。

请用中文回答，字数控制在 100 字以内。语气专业、让人安心、安全第一。`;

  const prompt = `用户遇到了一个电力问题："${description}"。请根据上述要求提供诊断建议。`;
  
  return await callAI(prompt, systemPrompt);
};

/**
 * AI 聊天机器人
 * @param history 对话历史
 * @param message 当前消息
 * @param userRole 用户角色（USER 或 ELECTRICIAN）
 * @param modelId 模型选择（deepseek, qwen, doubao）
 * @returns AI 回复
 */
export const chatWithBot = async (
  history: Array<{role: string, content: string}>, 
  message: string, 
  userRole: string = 'USER', 
  modelId: string = 'deepseek'
) => {
  let systemPrompt = "";
  let responsePrefix = "";

  // 根据 modelId 选择系统提示
  if (modelId === 'deepseek') {
    responsePrefix = "【DeepSeek 满血版】\n";
    systemPrompt = `你现在是 DeepSeek-V3，一个拥有极高智商的 AI 助手。不仅精通电力工程和家庭维修，也具备丰富的生活常识、逻辑推理能力和幽默感。请以专业且亲切的口吻回答用户的任何问题。`;
  } else if (modelId === 'qwen') {
    responsePrefix = "【通义千问】\n";
    systemPrompt = `你是通义千问，由阿里巴巴开发的 AI 助手。你精通电力工程、家庭维修和各类生活知识。请用专业、友好的态度回答用户问题。`;
  } else if (modelId === 'doubao') {
    responsePrefix = "【豆包 Vision】\n";
    systemPrompt = `你现在是豆包 AI，专注于视觉识别（模拟）和创意生活。你可以通过分析用户对画面的描述来提供灵感，比如灯具布局方案、电线隐藏技巧等。`;
  } else {
    // 默认模式：根据用户角色调整
    const electricianInstruction = `你叫'小安'，是'安电通'平台的专业技术顾问。你的服务对象是专业电工，请使用专业术语（如回路、额定电流、漏保灵敏度、接线端子、扭矩等）来回答技术性难题。`;
    const userInstruction = `你叫'小安'，是一个家庭电力维修 APP'安电通'的智能管家。你的服务对象是普通家庭用户。请用通俗易懂的语言解释电力故障，强调安全第一，建议不要非专业操作。`;
    systemPrompt = userRole === 'ELECTRICIAN' ? electricianInstruction : userInstruction;
  }

  // 构建完整的对话历史
  const messages = [
    { role: 'system', content: systemPrompt },
    ...history,
    { role: 'user', content: message }
  ];

  try {
    const { name, apiKey } = AI_PROVIDER;
    
    if (!apiKey) {
      console.warn(`AI API Key missing, using local mode`);
      return getLocalResponse(message);
    }

    // 根据配置的提供商调用 API
    let response;
    if (name === 'deepseek' || modelId === 'deepseek') {
      response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: messages as any,
          temperature: 0.7,
          max_tokens: 1000
        })
      });
    } else if (name === 'qwen' || modelId === 'qwen') {
      response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'qwen-turbo',
          input: {
            messages: messages as any
          },
          parameters: {
            temperature: 0.7,
            max_tokens: 1000
          }
        })
      });
    } else {
      return getLocalResponse(message);
    }

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || data.output?.text || getLocalResponse(message);
    
    return responsePrefix + aiResponse;
  } catch (error) {
    console.warn("AI Chat connection error, using offline mode:", error);
    return getLocalResponse(message);
  }
};
