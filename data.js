const generatePromptCard = ({ testNumber, topicEn, topicVn, centerEn, centerVn, idea1, idea2, idea3 }) => {
    const renderNode = (num, idea, posClass, isOwn = false) => `
        <div class="mm-node ${posClass} ${isOwn ? 'mm-node-own' : ''}" onclick="event.stopPropagation(); window.toggleNodeVn(this);" title="Bấm để ẩn/hiện nghĩa tiếng Việt">
            <span class="mm-badge ${isOwn ? 'mm-badge-own' : 'mm-badge-primary'}">${num}</span>
            <div class="mm-title-en">${idea.en}</div>
            <div class="mm-title-vn">${idea.vn}</div>
            <span class="mm-pos-tag ${isOwn ? 'mm-tag-own' : 'mm-tag-primary'}">${idea.tag}</span>
        </div>
    `;

    return `
    <div class="prompt-redesign-wrapper">
        <div class="prompt-top-bar">
            <div class="prompt-badge-group">
                <span class="prompt-test-badge">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" style="flex-shrink:0;"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>
                    <span>ĐỀ SỐ ${testNumber}</span>
                </span>
            </div>
        </div>

        <div class="prompt-topic-block" onclick="event.stopPropagation(); window.toggleTopicHeadlineVn(this);" title="Bấm để ẩn/hiện dịch câu chủ đề">
            <h2 class="prompt-topic-en">TOPIC: ${topicEn}</h2>
            <p class="prompt-topic-vn">Chủ đề: ${topicVn}</p>
        </div>

        <div class="mindmap-section-wrapper">
            <div class="mindmap-outer-box">
                <div class="mindmap">
                    ${renderNode(1, idea1, 'mm-pos-top')}
                    ${renderNode(4, { en: '[Your own idea]', vn: 'Ý kiến riêng của bạn', tag: 'Tự do' }, 'mm-pos-left', true)}
                    <div class="mm-center mm-pos-center" onclick="event.stopPropagation(); window.toggleNodeVn(this);" title="Bấm để ẩn/hiện nghĩa tiếng Việt">
                        <span class="mm-center-label">CHỦ ĐỀ</span>
                        <div class="mm-center-en">${centerEn}</div>
                        <div class="mm-center-vn">${centerVn}</div>
                    </div>
                    ${renderNode(2, idea2, 'mm-pos-right')}
                    ${renderNode(3, idea3, 'mm-pos-bottom')}
                </div>
            </div>
        </div>
    </div>
    `;
};

const ROLE_STYLE_MAP = {
    'Giải thích': 'role-explain',
    'Lý do': 'role-explain',
    'Chi tiết': 'role-detail',
    'Mở rộng': 'role-detail',
    'Ví dụ': 'role-example',
    'Kết quả': 'role-result',
    'Tác động': 'role-result'
};

const renderIdeaExpansionSection = (ideas) => {
    const cardsHtml = ideas.map(idea => {
        const stepsHtml = idea.steps.map((step, idx) => {
            const roleClass = ROLE_STYLE_MAP[step.role] || 'role-explain';
            const arrowHtml = idx < idea.steps.length - 1
                ? `<div class="exp-arrow" aria-hidden="true">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>
                   </div>`
                : '';

            return `
                <div class="exp-step-card" onclick="window.toggleExpStep(this)">
                    <span class="exp-role-badge ${roleClass}">${step.role}</span>
                    <div class="exp-step-vn">${step.vn}</div>
                    <div class="exp-step-en">
                        <span class="exp-en-tag">EN</span>
                        <span>${step.en}</span>
                    </div>
                </div>
                ${arrowHtml}
            `;
        }).join('');

        return `
            <div class="exp-card">
                <div class="exp-card-header" onclick="window.toggleExpHeader(this)" title="Bấm để xem/ẩn cụm tiếng Anh mở ý">
                    <div class="exp-header-main">
                        <span class="exp-num-badge">${idea.num}</span>
                        <span class="exp-idea-vn">${idea.titleVn}</span>
                    </div>
                    <span class="exp-idea-en-placeholder">Xem cụm mở ý</span>
                    <span class="exp-idea-en">➔ ${idea.coreEn}</span>
                </div>
                <div class="exp-steps-flow">
                    ${stepsHtml}
                </div>
            </div>
        `;
    }).join('');

    return `
        <div class="exp-section">
            <div class="exp-toolbar">
                <span class="exp-hint">💡 Bấm vào từng bước tư duy tiếng Việt để lật xem cụm tiếng Anh tương ứng</span>
                <button type="button" class="exp-toggle-all-btn" onclick="window.toggleAllExpEn(this)">Hiện tất cả tiếng Anh</button>
            </div>
            <div class="exp-cards-list">
                ${cardsHtml}
            </div>
        </div>
    `;
};

const generateIdeaExpansion = (ideas) => {
    if (!Array.isArray(ideas) && ideas && (ideas.b1 || ideas.b2)) {
        return `
            <div class="level-tabs-wrapper">
                <div class="level-switcher-bar">
                    <div class="level-segmented" role="tablist" aria-label="Chọn trình độ">
                        <button type="button" class="level-tab-btn level-b1 active" data-target-level="b1" onclick="window.switchLevelTab(this, 'b1')">
                            <span class="level-dot"></span>
                            <span>Level B1</span>
                        </button>
                        <button type="button" class="level-tab-btn level-b2" data-target-level="b2" onclick="window.switchLevelTab(this, 'b2')">
                            <span class="level-dot"></span>
                            <span>Level B2</span>
                        </button>
                    </div>
                </div>
                <div class="level-pane active" data-level-pane="b1">
                    ${renderIdeaExpansionSection(ideas.b1 || [])}
                </div>
                <div class="level-pane" data-level-pane="b2">
                    ${renderIdeaExpansionSection(ideas.b2 || [])}
                </div>
            </div>
        `;
    }
    return renderIdeaExpansionSection(ideas);
};

const mockTests = [
    {
        id: "theory",
        title: "Lý thuyết chung",
        topic: "Thông tin và dàn ý VSTEP Speaking Part 3",
        promptEn: `
<div style="line-height: 1.7; color: #1e293b;">
    <p style="margin-bottom: 12px;"><strong style="font-weight: 700; color: #0f172a;">Nội dung:</strong> 01 chủ đề xã hội + 03 main ideas của chủ đề đó => thí sinh cần phát triển 03 main ideas trong đề thành một bài nói hoàn chỉnh</p>
    <p style="margin-bottom: 12px;"><strong style="font-weight: 700; color: #0f172a;">Thời gian:</strong> 05 phút (01 phút chuẩn bị + 04 phút nói)</p>
    <p style="margin-bottom: 12px;"><strong style="font-weight: 700; color: #0f172a;">Câu hỏi mở rộng:</strong> sau khi nói xong chủ đề, vẫn còn 03 câu hỏi mở rộng liên quan tới chủ đề, thí sinh chỉ cần trả lời 01 trong 03 câu đó</p>
    <p style="margin-bottom: 12px;"><strong style="font-weight: 700; color: #0f172a;">Giao diện đề thi trên máy tính:</strong> Như trong hình minh họa bên dưới.</p>
    <div style="text-align: center; margin-top: 15px;">
        <img src="giao-dien.png" alt="Giao diện thi trên máy tính" style="max-width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    </div>
</div>`,
        promptVn: ``,
        vocab: `
            <div class="vocab-section" style="text-align: left; padding: 10px 0;">
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin-bottom: 15px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                    <strong style="color: #0f766e; font-size: 16.5px; font-weight: 700; display: block; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px; margin-bottom: 12px;">Mở bài:</strong>
                    <div style="color: #334155; font-size: 15.5px; line-height: 2.3;">
                        <span style="font-weight: 600; color: #0f172a; margin-right: 6px;">Today, I'd like to talk about</span>
                        <span class="intro-pill">the benefits of ...</span>
                        <span class="intro-pill">the downsides of ...</span>
                        <span class="intro-pill">the reasons why ...</span>
                        <span class="intro-pill">some ways to ...</span>
                        <span class="intro-pill">some factors to consider when/to ...</span>
                    </div>
                </div>

                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin-bottom: 15px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                    <strong style="color: #0f766e; font-size: 16.5px; display: block; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px; margin-bottom: 10px;">Thân bài:</strong>
                    <ul style="color: #334155; margin-top: 0; padding-left: 20px; line-height: 1.7; font-size: 15.5px;">
                        <li style="margin-bottom: 12px;"><strong style="color: #1d4ed8;">Firstly, / First of all</strong> + <em style="color: #ea580c; font-weight: 500;">main idea 01</em> <span style="color: #334155;">➔ giải thích + ví dụ + kết quả</span></li>
                        <li style="margin-bottom: 12px;"><strong style="color: #1d4ed8;">Secondly, / Besides, / Moreover</strong> + <em style="color: #ea580c; font-weight: 500;">main idea 02</em> <span style="color: #334155;">➔ giải thích + ví dụ + kết quả</span></li>
                        <li><strong style="color: #1d4ed8;">Finally,</strong> <em style="color: #ea580c; font-weight: 500;">main idea 03</em> <span style="color: #334155;">➔ giải thích + ví dụ + kết quả</span></li>
                    </ul>
                </div>

                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                    <strong style="color: #0f766e; font-size: 16.5px; display: block; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px; margin-bottom: 10px;">Kết bài:</strong>
                    <span style="color: #334155; display: inline-block; font-size: 15.5px; line-height: 2;">
                        <span style="display: inline-block; background-color: #f1f5f9; border: 1px solid #cbd5e1; color: #1d4ed8; padding: 1px 6px; border-radius: 4px; font-weight: bold; margin-right: 4px; font-size: 14.5px;">In conclusion,</span>
                        <span style="display: inline-block; background-color: #f1f5f9; border: 1px solid #cbd5e1; color: #1d4ed8; padding: 1px 6px; border-radius: 4px; font-weight: bold; margin-left: 2px; margin-right: 4px; font-size: 14.5px;">To sum up,</span> 
                        it's true that <strong style="color: #b91c1c;">[nguyên câu chủ đề]</strong>
                    </span>
                </div>
            </div>
        `,
        sample: []
    },
    {
        id: "test1",
        title: "Topic 01 🎵",
        topic: "Musical education plays a vital role in schools.",
        promptEn: generatePromptCard({
            testNumber: '01',
            topicEn: 'Musical education plays a vital role in schools.',
            topicVn: 'Giáo dục âm nhạc đóng vai trò quan trọng trong trường học.',
            centerEn: 'Musical education',
            centerVn: 'Giáo dục âm nhạc',
            idea1: { en: 'Memory development', vn: 'Phát triển trí nhớ', tag: 'Cụm danh từ' },
            idea2: { en: 'Emotional development', vn: 'Phát triển cảm xúc', tag: 'Cụm danh từ' },
            idea3: { en: 'Language development', vn: 'Phát triển ngôn ngữ', tag: 'Cụm danh từ' }
        }),
        promptVn: `<strong>Chủ đề:</strong> Giáo dục âm nhạc đóng vai trò quan trọng trong trường học.<br>`,
        vocab: generateIdeaExpansion([
            {
                num: '1',
                titleVn: 'Phát triển trí nhớ',
                coreEn: 'help students develop memory',
                steps: [
                    {
                        role: 'Giải thích',
                        vn: 'Khi học hát hoặc tập chơi một nhạc cụ mới',
                        en: 'learn how to sing a song or play a new instrument'
                    },
                    {
                        role: 'Chi tiết',
                        vn: 'Học sinh phải ghi nhớ cả lời bài hát lẫn giai điệu',
                        en: 'need to remember the lyrics and the melody'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Nhờ đó rèn luyện não bộ để nhớ tốt và lâu hơn',
                        en: 'train their brains to remember longer'
                    }
                ]
            },
            {
                num: '2',
                titleVn: 'Phát triển cảm xúc',
                coreEn: 'help students develop emotions',
                steps: [
                    {
                        role: 'Giải thích',
                        vn: 'Âm nhạc giúp các em giải tỏa và bộc lộ cảm xúc (vui, buồn...)',
                        en: 'help people express their emotions (happiness, sadness...)'
                    },
                    {
                        role: 'Ví dụ',
                        vn: 'Nghe hay hát một bài yêu thích sau những giờ học căng thẳng',
                        en: 'listen to music after long stressful hours of studying'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Đầu óc được thư giãn và giữ tinh thần tích cực hơn',
                        en: 'feel relaxed and stay more positive'
                    }
                ]
            },
            {
                num: '3',
                titleVn: 'Phát triển ngôn ngữ',
                coreEn: 'a great way to learn languages',
                steps: [
                    {
                        role: 'Ví dụ',
                        vn: 'Chẳng hạn khi nghe và hát theo các bài hát tiếng Anh',
                        en: 'listen to and sing English songs'
                    },
                    {
                        role: 'Giải thích',
                        vn: 'Tiếp thu thêm nhiều từ vựng mới một cách rất tự nhiên',
                        en: 'learn new English vocabulary naturally'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Cải thiện rõ rệt cả kỹ năng nghe lẫn phát âm',
                        en: 'improve listening skills and pronunciation'
                    }
                ]
            }
        ]),
        sample: [
            {
                en: "Today, I'd like to talk about musical education.",
                vn: "Hôm nay, tôi muốn nói về giáo dục âm nhạc."
            },
            {
                en: "Firstly, musical education helps students develop memory. This is because when students learn how to sing a song or learn a new instrument, they need to remember the lyrics and the melody of the song. As a result, they can train their brains to remember longer.",
                vn: "Đầu tiên, giáo dục âm nhạc giúp học sinh phát triển trí nhớ. Điều này là do khi học sinh học hát hoặc học một nhạc cụ mới, họ cần nhớ lời và giai điệu của bài hát. Kết quả là, họ có thể rèn luyện não bộ để nhớ lâu hơn."
            },
            {
                en: "Moreover, musical education helps students develop emotions. This is because music can help people express their emotions. It also helps students feel relaxed and more positive.",
                vn: "Hơn nữa, giáo dục âm nhạc giúp học sinh phát triển cảm xúc. Điều này là do âm nhạc có thể giúp con người thể hiện cảm xúc của mình. Nó cũng giúp học sinh cảm thấy thư giãn và tích cực hơn."
            },
            {
                en: "Finally, it’s also a great way to learn languages. For example, when students sing English songs, they can learn English vocabulary and improve listening skills. They can also improve pronunciation.",
                vn: "Cuối cùng, nó cũng là một cách tuyệt vời để học ngôn ngữ. Ví dụ, khi học sinh hát các bài hát tiếng Anh, họ có thể học từ vựng tiếng Anh và cải thiện kỹ năng nghe. Họ cũng có thể cải thiện phát âm."
            },
            {
                en: "To sum up, it’s true that musical education plays a vital role in schools.",
                vn: "Tóm lại, đúng là giáo dục âm nhạc đóng vai trò quan trọng trong trường học."
            }
        ]
    },
    {
        id: "test2",
        title: "Topic 02 👮",
        topic: "The crime rate can be reduced in several ways.",
        promptEn: generatePromptCard({
            testNumber: '02',
            topicEn: 'The crime rate can be reduced in several ways.',
            topicVn: 'Tỷ lệ tội phạm có thể được giảm bằng nhiều cách.',
            centerEn: 'The crime rate',
            centerVn: 'Tỷ lệ tội phạm',
            idea1: { en: 'Education', vn: 'Giáo dục', tag: 'Danh từ' },
            idea2: { en: 'Install camera in public places', vn: 'Lắp camera ở nơi công cộng', tag: 'Động từ' },
            idea3: { en: 'Increase employment opportunities', vn: 'Tăng cơ hội việc làm', tag: 'Động từ' }
        }),
        promptVn: `<strong>Chủ đề:</strong> Tỷ lệ tội phạm có thể được giảm bằng nhiều cách.<br>`,
        vocab: generateIdeaExpansion([
            {
                num: '1',
                titleVn: 'Giáo dục',
                coreEn: 'educate people better',
                steps: [
                    {
                        role: 'Giải thích',
                        vn: 'Giúp mọi người phân biệt rõ điều gì là đúng, điều gì là sai',
                        en: 'understand what is right and wrong'
                    },
                    {
                        role: 'Chi tiết',
                        vn: 'Hiểu được hậu quả nghiêm trọng nếu làm trái pháp luật',
                        en: 'know the bad results of breaking the law'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Biết suy nghĩ kỹ hơn và tránh xa các hành vi phạm tội',
                        en: 'think carefully and stay away from crimes'
                    }
                ]
            },
            {
                num: '2',
                titleVn: 'Lắp camera ở nơi công cộng',
                coreEn: 'install cameras in public places',
                steps: [
                    {
                        role: 'Giải thích',
                        vn: 'Kẻ xấu biết mình đang bị ghi hình ở ngoài đường, cửa hàng...',
                        en: 'bad people know cameras are watching them'
                    },
                    {
                        role: 'Chi tiết',
                        vn: 'Sợ bị cảnh sát phát hiện và bắt giữ nên không dám làm bậy',
                        en: 'feel afraid of the police and do not dare to steal'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Người dân đi lại ngoài đường cảm thấy yên tâm, an toàn hơn',
                        en: 'make everyone feel safe when going out'
                    }
                ]
            },
            {
                num: '3',
                titleVn: 'Tăng cơ hội việc làm',
                coreEn: 'create more jobs for people',
                steps: [
                    {
                        role: 'Lý do',
                        vn: 'Nhiều người đi trộm cắp chỉ vì thất nghiệp, túng thiếu tiền bạc',
                        en: 'some people steal because they have no job and no money'
                    },
                    {
                        role: 'Giải thích',
                        vn: 'Có việc làm ổn định giúp họ tự kiếm tiền nuôi sống bản thân',
                        en: 'have a stable job to earn money and support themselves'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Không cần phải làm chuyện phạm pháp để kiếm sống nữa',
                        en: 'do not need to commit crimes to survive'
                    }
                ]
            }
        ]),
        sample: [
            {
                en: "Today, I'd like to talk about the crime rate.",
                vn: "Hôm nay, tôi muốn nói về tỷ lệ tội phạm."
            },
            {
                en: "Firstly, one way to reduce the crime rate is education. This is because education helps people understand what is right and wrong. When people are well-educated, they will be less likely to commit crimes.",
                vn: "Đầu tiên, một cách để giảm tỷ lệ tội phạm là giáo dục. Điều này là do giáo dục giúp mọi người hiểu điều gì là đúng và sai. Khi mọi người được giáo dục tốt, họ sẽ ít có khả năng phạm tội hơn."
            },
            {
                en: "Moreover, we can reduce crime by installing cameras in public places. When people know they are being watched, they will be less likely to do illegal activities. Therefore, cameras can make people feel safe.",
                vn: "Hơn nữa, chúng ta có thể giảm tội phạm bằng cách lắp đặt camera ở những nơi công cộng. Khi mọi người biết họ đang bị theo dõi, họ sẽ ít có khả năng thực hiện các hoạt động bất hợp pháp. Do đó, camera có thể làm cho mọi người cảm thấy an toàn."
            },
            {
                en: "Finally, we can reduce crime by increasing employment opportunities. When people have jobs, they can earn money in a legal way and support themselves. So, they don’t need to commit crimes to survive.",
                vn: "Cuối cùng, chúng ta có thể giảm tội phạm bằng cách tăng cơ hội việc làm. Khi mọi người có việc làm, họ có thể kiếm tiền một cách hợp pháp và nuôi sống bản thân. Vì vậy, họ không cần phải phạm tội để tồn tại."
            },
            {
                en: "To sum up, it’s true that the crime rate can be reduced in several ways.",
                vn: "Tóm lại, đúng là tỷ lệ tội phạm có thể được giảm bằng nhiều cách."
            }
        ]
    },
    {
        id: "test3",
        title: "Topic 03 🧹",
        topic: "Housemaids are becoming more common in many urban families.",
        promptEn: generatePromptCard({
            testNumber: '03',
            topicEn: 'Housemaids are becoming more common in many urban families.',
            topicVn: 'Người giúp việc gia đình đang trở nên phổ biến hơn ở nhiều gia đình thành thị.',
            centerEn: 'Housemaids',
            centerVn: 'Người giúp việc gia đình',
            idea1: { en: 'More relaxing time', vn: 'Có thêm thời gian thư giãn', tag: 'Cụm danh từ' },
            idea2: { en: 'A tidier home', vn: 'Ngôi nhà gọn gàng hơn', tag: 'Cụm danh từ' },
            idea3: { en: 'Better social skills for family members', vn: 'Kỹ năng xã hội tốt hơn cho các thành viên', tag: 'Cụm danh từ' }
        }),
        promptVn: `<strong>Chủ đề:</strong> Người giúp việc gia đình đang trở nên phổ biến hơn ở nhiều gia đình thành thị.<br>`,
        vocab: generateIdeaExpansion([
            {
                num: '1',
                titleVn: 'Có thêm thời gian thư giãn',
                coreEn: 'have more time to relax',
                steps: [
                    {
                        role: 'Lý do',
                        vn: 'Ở thành phố, bố mẹ thường đi làm cả ngày rất bận rộn',
                        en: 'parents in big cities are very busy with work all day'
                    },
                    {
                        role: 'Giải thích',
                        vn: 'Có người phụ giúp nên không phải vất vả làm việc nhà mỗi tối',
                        en: 'do not have to spend hours doing housework after work'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Có thêm thời gian nghỉ ngơi và trò chuyện, chơi cùng con cái',
                        en: 'have more time to rest and play with their kids'
                    }
                ]
            },
            {
                num: '2',
                titleVn: 'Ngôi nhà gọn gàng hơn',
                coreEn: 'keep the house cleaner and tidier',
                steps: [
                    {
                        role: 'Giải thích',
                        vn: 'Người giúp việc làm quen tay và dọn dẹp nhà cửa đều đặn mỗi ngày',
                        en: 'clean and take care of the house every day'
                    },
                    {
                        role: 'Ví dụ',
                        vn: 'Chẳng hạn như quét lau sàn, giặt đồ và rửa chén bát sạch sẽ',
                        en: 'sweep the floor, wash clothes, and clean the dishes'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Đi làm về thấy nhà cửa ngăn nắp nên dễ chịu hơn hẳn',
                        en: 'feel comfortable coming home to a clean house'
                    }
                ]
            },
            {
                num: '3',
                titleVn: 'Kỹ năng xã hội tốt hơn cho các thành viên',
                coreEn: 'improve social skills for family members',
                steps: [
                    {
                        role: 'Giải thích',
                        vn: 'Trong nhà có thêm người nên trẻ nhỏ được giao tiếp nhiều hơn',
                        en: 'children have more chances to talk with another person'
                    },
                    {
                        role: 'Ví dụ',
                        vn: 'Các bé học cách chào hỏi lễ phép, nhờ giúp đỡ và nói lời cảm ơn',
                        en: 'learn to greet politely, ask for help, and say thank you'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Trở nên cởi mở, lịch sự và biết tôn trọng mọi người hơn',
                        en: 'become more friendly, polite, and respectful'
                    }
                ]
            }
        ]),
        sample: [
            {
                en: "Today, I'd like to talk about housemaids.",
                vn: "Hôm nay, tôi muốn nói về người giúp việc gia đình."
            },
            {
                en: "Firstly, family members will have more relaxing time. This is because in urban cities, many people are too busy with their work. They don’t have much time to do the housework, so they decide to hire a housemaid to have more time to rest.",
                vn: "Đầu tiên, các thành viên trong gia đình sẽ có nhiều thời gian thư giãn hơn. Điều này là do ở các thành phố đô thị, nhiều người quá bận rộn với công việc của họ. Họ không có nhiều thời gian để làm việc nhà, vì vậy họ quyết định thuê người giúp việc để có thêm thời gian nghỉ ngơi."
            },
            {
                en: "Moreover, a housemaid can make the house tidier. A housemaid can do the housework like cleaning the house, washing clothes and washing dishes. Therefore, the house will become cleaner and tidier.",
                vn: "Hơn nữa, một người giúp việc có thể làm cho ngôi nhà gọn gàng hơn. Một người giúp việc có thể làm việc nhà như dọn dẹp nhà cửa, giặt quần áo và rửa chén bát. Do đó, ngôi nhà sẽ trở nên sạch sẽ và gọn gàng hơn."
            },
            {
                en: "Finally, having a housemaid helps family members develop social skills. Children can learn how to communicate and behave politely. Therefore, they will become more friendly.",
                vn: "Cuối cùng, việc có người giúp việc giúp các thành viên trong gia đình phát triển kỹ năng xã hội. Trẻ em có thể học cách giao tiếp và cư xử lịch sự. Do đó, chúng sẽ trở nên thân thiện hơn."
            },
            {
                en: "To sum up, it’s true that housemaids are becoming more common in many urban families.",
                vn: "Tóm lại, đúng là người giúp việc gia đình đang trở nên phổ biến hơn ở nhiều gia đình thành thị."
            }
        ]
    },
    {
        id: "test4",
        title: "Topic 04 🏢",
        topic: "Staying in a dormitory offers students many benefits.",
        promptEn: generatePromptCard({
            testNumber: '04',
            topicEn: 'Staying in a dormitory offers students many benefits.',
            topicVn: 'Ở ký túc xá mang lại nhiều lợi ích cho sinh viên.',
            centerEn: 'Staying in a dormitory',
            centerVn: 'Ở ký túc xá',
            idea1: { en: 'Making friends', vn: 'Kết bạn', tag: 'Danh động từ' },
            idea2: { en: 'Nearby classes', vn: 'Gần lớp học', tag: 'Cụm danh từ' },
            idea3: { en: 'Learning more skills', vn: 'Học thêm kỹ năng', tag: 'Danh động từ' }
        }),
        promptVn: `<strong>Chủ đề:</strong> Ở ký túc xá mang lại nhiều lợi ích cho sinh viên.<br>`,
        vocab: generateIdeaExpansion([
            {
                num: '1',
                titleVn: 'Kết bạn',
                coreEn: 'make many new friends',
                steps: [
                    {
                        role: 'Giải thích',
                        vn: 'Sinh viên sống chung phòng với các bạn đến từ nhiều nơi khác nhau',
                        en: 'share a room with students from different places'
                    },
                    {
                        role: 'Ví dụ',
                        vn: 'Hằng ngày cùng nhau ăn cơm, trò chuyện và chỉ bài cho nhau',
                        en: 'eat, talk, and study together every day'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Đỡ thấy cô đơn khi sống xa nhà và có thêm nhiều bạn thân',
                        en: 'do not feel lonely and have close friends'
                    }
                ]
            },
            {
                num: '2',
                titleVn: 'Gần lớp học',
                coreEn: 'live very close to classes',
                steps: [
                    {
                        role: 'Giải thích',
                        vn: 'Ký túc xá thường nằm ngay bên trong khuôn viên trường đại học',
                        en: 'dormitories are usually right inside the school campus'
                    },
                    {
                        role: 'Chi tiết',
                        vn: 'Chỉ cần đi bộ vài phút là tới lớp, không lo kẹt xe hay trễ giờ',
                        en: 'just walk a few minutes to class without traffic jams'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Tiết kiệm được cả thời gian đi lại lẫn tiền xăng xe mỗi tháng',
                        en: 'save both travel time and money'
                    }
                ]
            },
            {
                num: '3',
                titleVn: 'Học thêm kỹ năng',
                coreEn: 'learn useful life skills',
                steps: [
                    {
                        role: 'Giải thích',
                        vn: 'Sống xa bố mẹ nên sinh viên phải tự tay lo mọi sinh hoạt cá nhân',
                        en: 'live far from parents and take care of themselves'
                    },
                    {
                        role: 'Ví dụ',
                        vn: 'Tự dọn phòng, giặt đồ, tính toán chi tiêu và nhường nhịn bạn cùng phòng',
                        en: 'clean the room, manage money, and get along with roommates'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Trở nên tự lập, có trách nhiệm và trưởng thành hơn nhiều',
                        en: 'become more independent and mature'
                    }
                ]
            }
        ]),
        sample: [
            {
                en: "Today, I'd like to talk about staying in a dormitory.",
                vn: "Hôm nay, tôi muốn nói về việc ở ký túc xá."
            },
            {
                en: "Firstly, students can make more friends. This is because when living in a dormitory, students share rooms and common spaces with others. They can talk, study, and spend time together every day.",
                vn: "Đầu tiên, sinh viên có thể kết bạn nhiều hơn. Điều này là do khi sống ở ký túc xá, sinh viên ở chung phòng và không gian chung với người khác. Họ có thể nói chuyện, học tập và dành thời gian cùng nhau mỗi ngày."
            },
            {
                en: "Moreover, staying in a dormitory is very convenient for studying. Most dormitories are located inside the campus, so students don’t need to travel far. This helps them save time and energy.",
                vn: "Hơn nữa, ở ký túc xá rất thuận tiện cho việc học. Hầu hết các ký túc xá nằm trong khuôn viên trường, vì vậy sinh viên không cần phải đi xa. Điều này giúp họ tiết kiệm thời gian và sức lực."
            },
            {
                en: "Finally, living in a dormitory helps students learn many important life skills. They need to take care of themselves, such as cleaning their room, managing time, and solving problems. Therefore, students become more independent and responsible.",
                vn: "Cuối cùng, sống ở ký túc xá giúp sinh viên học được nhiều kỹ năng sống quan trọng. Họ cần tự chăm sóc bản thân, chẳng hạn như dọn dẹp phòng, quản lý thời gian và giải quyết vấn đề. Do đó, sinh viên trở nên tự lập và có trách nhiệm hơn."
            },
            {
                en: "To sum up, it’s true that staying in a dormitory offers many benefits for students.",
                vn: "Tóm lại, đúng là ở ký túc xá mang lại nhiều lợi ích cho sinh viên."
            }
        ]
    },
    {
        id: "test5",
        title: "Topic 05 🏙️",
        topic: "Living in an apartment has some disadvantages.",
        promptEn: generatePromptCard({
            testNumber: '05',
            topicEn: 'Living in an apartment has some disadvantages.',
            topicVn: 'Sống trong căn hộ có một số nhược điểm.',
            centerEn: 'Living in an apartment',
            centerVn: 'Sống trong căn hộ',
            idea1: { en: 'Small space', vn: 'Không gian nhỏ', tag: 'Cụm danh từ' },
            idea2: { en: 'Pet restriction', vn: 'Hạn chế thú cưng', tag: 'Cụm danh từ' },
            idea3: { en: 'Noise from neighbor', vn: 'Tiếng ồn từ hàng xóm', tag: 'Cụm danh từ' }
        }),
        promptVn: `<strong>Chủ đề:</strong> Sống trong căn hộ có một số nhược điểm.<br>`,
        vocab: generateIdeaExpansion([
            {
                num: '1',
                titleVn: 'Không gian nhỏ',
                coreEn: 'the living space is quite small',
                steps: [
                    {
                        role: 'Giải thích',
                        vn: 'Đa số các căn hộ chung cư ở thành phố có diện tích khá hạn chế',
                        en: 'most apartments in big cities are not very large'
                    },
                    {
                        role: 'Ví dụ',
                        vn: 'Không có sân vườn riêng và thiếu chỗ để bày nhiều đồ đạc',
                        en: 'have no garden and little space for furniture'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Đôi khi tạo cảm giác hơi bí bách, chật chội nếu gia đình đông người',
                        en: 'feel crowded and a bit uncomfortable'
                    }
                ]
            },
            {
                num: '2',
                titleVn: 'Hạn chế thú cưng',
                coreEn: 'cannot keep pets freely',
                steps: [
                    {
                        role: 'Giải thích',
                        vn: 'Nhiều tòa chung cư cấm nuôi chó mèo để giữ vệ sinh và tránh ồn',
                        en: 'many apartment buildings do not allow dogs or cats'
                    },
                    {
                        role: 'Chi tiết',
                        vn: 'Điều này rất bất tiện và đáng tiếc cho những người yêu động vật',
                        en: 'a big problem for people who love animals'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Họ đành phải từ bỏ sở thích nuôi thú cưng trong nhà',
                        en: 'cannot enjoy keeping a pet at home'
                    }
                ]
            },
            {
                num: '3',
                titleVn: 'Tiếng ồn từ hàng xóm',
                coreEn: 'get bothered by noise from neighbors',
                steps: [
                    {
                        role: 'Giải thích',
                        vn: 'Các căn hộ nằm sát vách và ngay tầng trên - tầng dưới với nhau',
                        en: 'people live very close to each other in one building'
                    },
                    {
                        role: 'Ví dụ',
                        vn: 'Dễ nghe tiếng trẻ con chạy nhảy, kéo bàn ghế hay mở nhạc to ban đêm',
                        en: 'hear loud music, footsteps, or kids running at night'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Khó nghỉ ngơi yên tĩnh hoặc bị mất ngủ sau ngày làm việc mệt',
                        en: 'feel annoyed and find it hard to sleep well'
                    }
                ]
            }
        ]),
        sample: [
            {
                en: "Today, I'd like to talk about living in an apartment.",
                vn: "Hôm nay, tôi muốn nói về việc sống trong căn hộ."
            },
            {
                en: "Firstly, one disadvantage of living in an apartment is small space. This is because most apartments are not very large, especially in big cities. People may not have enough room for all their furniture or personal things. Therefore, it can feel uncomfortable and crowded.",
                vn: "Đầu tiên, một nhược điểm của việc sống trong căn hộ là không gian nhỏ. Điều này là do hầu hết các căn hộ không lớn lắm, đặc biệt là ở các thành phố lớn. Mọi người có thể không có đủ chỗ cho tất cả đồ đạc hoặc vật dụng cá nhân của họ. Do đó, nó có thể cảm thấy không thoải mái và chật chội."
            },
            {
                en: "Moreover, another problem is pet restriction. Many apartment buildings do not allow pets, or they only allow small animals. This can be a problem for people who love animals. As a result, they cannot enjoy having a pet at home.",
                vn: "Hơn nữa, một vấn đề khác là hạn chế thú cưng. Nhiều tòa nhà chung cư không cho phép nuôi thú cưng, hoặc họ chỉ cho phép những động vật nhỏ. Đây có thể là một vấn đề đối với những người yêu động vật. Kết quả là, họ không thể tận hưởng việc có một thú cưng ở nhà."
            },
            {
                en: "Finally, noise from neighbors can be a major issue. In an apartment, people live very close to each other, so it is easy to hear sounds from next door. For example, neighbors may play loud music, talk loudly, or move furniture at night. Therefore, it can be difficult to relax or sleep well.",
                vn: "Cuối cùng, tiếng ồn từ hàng xóm có thể là một vấn đề lớn. Trong một căn hộ, mọi người sống rất gần nhau, vì vậy rất dễ nghe thấy âm thanh từ nhà bên cạnh. Ví dụ, hàng xóm có thể mở nhạc lớn, nói chuyện lớn tiếng hoặc di chuyển đồ đạc vào ban đêm. Do đó, có thể khó thư giãn hoặc ngủ ngon."
            },
            {
                en: "To sum up, it’s true that living in an apartment has several disadvantages.",
                vn: "Tóm lại, đúng là sống trong căn hộ có một số nhược điểm."
            }
        ]
    },
    {
        id: "test6",
        title: "Topic 06 🤝",
        topic: "Teamwork plays an important role in young people’s lives.",
        promptEn: generatePromptCard({
            testNumber: '06',
            topicEn: 'Teamwork plays an important role in young people’s lives.',
            topicVn: 'Làm việc nhóm đóng vai trò quan trọng trong cuộc sống của người trẻ.',
            centerEn: 'Teamwork',
            centerVn: 'Làm việc nhóm',
            idea1: { en: 'Cooperation', vn: 'Sự hợp tác', tag: 'Danh từ' },
            idea2: { en: 'Leadership', vn: 'Lãnh đạo', tag: 'Danh từ' },
            idea3: { en: 'Effective work', vn: 'Công việc hiệu quả', tag: 'Cụm danh từ' }
        }),
        promptVn: `<strong>Chủ đề:</strong> Làm việc nhóm đóng vai trò quan trọng trong cuộc sống của người trẻ.<br>`,
        vocab: generateIdeaExpansion([
            {
                num: '1',
                titleVn: 'Sự hợp tác',
                coreEn: 'learn how to work well with others',
                steps: [
                    {
                        role: 'Giải thích',
                        vn: 'Khi làm chung nhóm, không ai có thể chỉ làm theo ý riêng của mình',
                        en: 'cannot just do things in their own way'
                    },
                    {
                        role: 'Chi tiết',
                        vn: 'Mọi người phải biết lắng nghe, góp ý và phụ giúp lẫn nhau',
                        en: 'listen to others, share ideas, and help each other'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Biết cách phối hợp nhịp nhàng và sống hòa đồng hơn',
                        en: 'cooperate smoothly and get along well with people'
                    }
                ]
            },
            {
                num: '2',
                titleVn: 'Lãnh đạo',
                coreEn: 'develop leadership skills',
                steps: [
                    {
                        role: 'Giải thích',
                        vn: 'Trong nhóm luôn cần một người đứng ra tổ chức và dẫn dắt chung',
                        en: 'a group always needs a leader to guide everyone'
                    },
                    {
                        role: 'Ví dụ',
                        vn: 'Tập cách chia việc cho các bạn và đứng ra giải quyết bất đồng',
                        en: 'learn to divide tasks and solve group problems'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Tự tin hơn và có kinh nghiệm quản lý rất tốt cho tương lai',
                        en: 'become more confident and gain skills for future jobs'
                    }
                ]
            },
            {
                num: '3',
                titleVn: 'Công việc hiệu quả',
                coreEn: 'make work faster and more effective',
                steps: [
                    {
                        role: 'Giải thích',
                        vn: 'Nhiều người cùng chung tay thì việc nặng cũng thành nhẹ nhàng',
                        en: 'many people share the work together'
                    },
                    {
                        role: 'Ví dụ',
                        vn: 'Làm bài thuyết trình: bạn tìm tài liệu, bạn làm slide, bạn đứng nói',
                        en: 'one finds info, another makes slides, and one speaks'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Hoàn thành nhiệm vụ nhanh hơn và đạt kết quả tốt hơn hẳn',
                        en: 'finish tasks much faster and get better results'
                    }
                ]
            }
        ]),
        sample: [
            {
                en: "Today, I'd like to talk about teamwork.",
                vn: "Hôm nay, tôi muốn nói về làm việc nhóm."
            },
            {
                en: "Firstly, teamwork helps young people learn how to cooperate with others. This is because when working in a team, everyone needs to share ideas and support each other. Therefore, they learn how to listen and work well with others.",
                vn: "Đầu tiên, làm việc nhóm giúp người trẻ học cách hợp tác với người khác. Điều này là do khi làm việc trong một nhóm, mọi người cần chia sẻ ý tưởng và hỗ trợ lẫn nhau. Do đó, họ học được cách lắng nghe và làm việc tốt với người khác."
            },
            {
                en: "Moreover, teamwork helps develop leadership skills. When working in a group, one person may become the leader and guide the team. This person learns how to organize work and make decisions.",
                vn: "Hơn nữa, làm việc nhóm giúp phát triển kỹ năng lãnh đạo. Khi làm việc trong một nhóm, một người có thể trở thành người lãnh đạo và hướng dẫn nhóm. Người này học được cách tổ chức công việc và đưa ra quyết định."
            },
            {
                en: "Finally, teamwork makes work more effective. When many people work together, they can complete tasks faster and better. Each person can focus on what they are good at. For example, one student can do research, while another designs slides for a presentation.",
                vn: "Cuối cùng, làm việc nhóm làm cho công việc hiệu quả hơn. Khi nhiều người làm việc cùng nhau, họ có thể hoàn thành nhiệm vụ nhanh hơn và tốt hơn. Mỗi người có thể tập trung vào những gì họ giỏi. Ví dụ, một sinh viên có thể làm nghiên cứu, trong khi một sinh viên khác thiết kế slide cho bài thuyết trình."
            },
            {
                en: "To sum up, it’s true that teamwork plays an important role in young people’s lives.",
                vn: "Tóm lại, đúng là làm việc nhóm đóng một vai trò quan trọng trong cuộc sống của người trẻ."
            }
        ]
    },
    {
        id: "test7",
        title: "Topic 07 💼",
        topic: "There are several factors to consider when applying for a job.",
        promptEn: generatePromptCard({
            testNumber: '07',
            topicEn: 'There are several factors to consider when applying for a job.',
            topicVn: 'Có một số yếu tố cần xem xét khi nộp đơn xin việc.',
            centerEn: 'Applying for a job',
            centerVn: 'Nộp đơn xin việc',
            idea1: { en: 'Salary', vn: 'Tiền lương', tag: 'Danh từ' },
            idea2: { en: 'Location', vn: 'Vị trí', tag: 'Danh từ' },
            idea3: { en: 'Working environment', vn: 'Môi trường làm việc', tag: 'Cụm danh từ' }
        }),
        promptVn: `<strong>Chủ đề:</strong> Có một số yếu tố cần xem xét khi nộp đơn xin việc.<br>`,
        vocab: generateIdeaExpansion([
            {
                num: '1',
                titleVn: 'Tiền lương',
                coreEn: 'salary is the first thing to consider',
                steps: [
                    {
                        role: 'Lý do',
                        vn: 'Ai đi làm cũng cần thu nhập để trang trải cuộc sống hằng ngày',
                        en: 'everyone needs money to pay for daily life'
                    },
                    {
                        role: 'Ví dụ',
                        vn: 'Lo tiền ăn uống, thuê nhà, xăng xe và phụ giúp gia đình',
                        en: 'pay for food, house rent, travel, and support family'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Lương tốt giúp cuộc sống ổn định và có động lực làm việc hơn',
                        en: 'live comfortably and feel motivated to work hard'
                    }
                ]
            },
            {
                num: '2',
                titleVn: 'Vị trí',
                coreEn: 'the location of the workplace is important',
                steps: [
                    {
                        role: 'Giải thích',
                        vn: 'Nếu chỗ làm quá xa nhà thì việc đi lại mỗi ngày rất vất vả',
                        en: 'if the office is too far, traveling every day is hard'
                    },
                    {
                        role: 'Ví dụ',
                        vn: 'Mất hàng tiếng ngoài đường chịu cảnh kẹt xe, nắng mưa bụi bặm',
                        en: 'spend hours in traffic jams or bad weather'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Chọn công ty gần nhà giúp đỡ mệt mỏi và tiết kiệm thời gian',
                        en: 'feel less tired and save a lot of time'
                    }
                ]
            },
            {
                num: '3',
                titleVn: 'Môi trường làm việc',
                coreEn: 'care about a good working environment',
                steps: [
                    {
                        role: 'Lý do',
                        vn: 'Chúng ta dành khoảng 8 tiếng mỗi ngày ở nơi làm việc',
                        en: 'spend about eight hours every day at work'
                    },
                    {
                        role: 'Chi tiết',
                        vn: 'Có sếp tâm lý và đồng nghiệp hòa đồng sẽ dễ hỏi han, hỗ trợ nhau',
                        en: 'have supportive bosses and friendly coworkers'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Đi làm thấy vui vẻ, bớt áp lực và muốn gắn bó lâu dài',
                        en: 'feel happy, less stressed, and stay longer'
                    }
                ]
            }
        ]),
        sample: [
            {
                en: "Today, I'd like to talk about applying for a job.",
                vn: "Hôm nay, tôi muốn nói về việc nộp đơn xin việc."
            },
            {
                en: "Firstly, one important factor when applying for a job is salary. This is because people need money to pay for their daily expenses such as food, rent, and transportation. A good salary can help them live more comfortably.",
                vn: "Đầu tiên, một yếu tố quan trọng khi nộp đơn xin việc là tiền lương. Điều này là do mọi người cần tiền để chi trả cho các chi phí sinh hoạt hàng ngày như thức ăn, tiền thuê nhà và đi lại. Một mức lương tốt có thể giúp họ sống thoải mái hơn."
            },
            {
                en: "Moreover, another important factor is location. If the workplace is too far from home, they may spend a lot of time traveling. For instance, someone may need to travel two hours every day to go to work, which can be very tiring.",
                vn: "Hơn nữa, một yếu tố quan trọng khác là vị trí. Nếu nơi làm việc quá xa nhà, họ có thể dành nhiều thời gian để đi lại. Ví dụ, một người nào đó có thể cần đi lại hai giờ mỗi ngày để đi làm, điều này có thể rất mệt mỏi."
            },
            {
                en: "Finally, the working environment also plays an important role. A good working environment can make people feel comfortable and motivated. This includes friendly colleagues, supportive managers, and a safe workplace.",
                vn: "Cuối cùng, môi trường làm việc cũng đóng một vai trò quan trọng. Một môi trường làm việc tốt có thể làm cho mọi người cảm thấy thoải mái và có động lực. Điều này bao gồm những đồng nghiệp thân thiện, những người quản lý luôn hỗ trợ và một nơi làm việc an toàn."
            },
            {
                en: "To sum up, it’s true that there are several important factors to consider when applying for a job.",
                vn: "Tóm lại, đúng là có một số yếu tố quan trọng cần xem xét khi nộp đơn xin việc."
            }
        ]
    },
    {
        id: "test8",
        title: "Topic 08 📱",
        topic: "E-books are becoming increasingly popular in today’s modern society.",
        promptEn: generatePromptCard({
            testNumber: '08',
            topicEn: 'E-books are becoming increasingly popular in today’s modern society.',
            topicVn: 'Sách điện tử đang ngày càng trở nên phổ biến trong xã hội hiện đại ngày nay.',
            centerEn: 'E-books',
            centerVn: 'Sách điện tử',
            idea1: { en: 'Convenient', vn: 'Tiện lợi', tag: 'Tính từ' },
            idea2: { en: 'Easy access', vn: 'Dễ dàng truy cập', tag: 'Cụm danh từ' },
            idea3: { en: 'Knowledge', vn: 'Kiến thức', tag: 'Danh từ' }
        }),
        promptVn: `<strong>Chủ đề:</strong> Sách điện tử đang ngày càng trở nên phổ biến trong xã hội hiện đại ngày nay.<br>`,
        vocab: generateIdeaExpansion([
            {
                num: '1',
                titleVn: 'Tiện lợi',
                coreEn: 'e-books are very convenient',
                steps: [
                    {
                        role: 'Giải thích',
                        vn: 'Chỉ cần một chiếc điện thoại hay máy tính bảng là lưu được cả trăm cuốn sách',
                        en: 'keep hundreds of books in just one phone or tablet'
                    },
                    {
                        role: 'Chi tiết',
                        vn: 'Không cần phải mang vác nhiều cuốn sách giấy dày và nặng theo người',
                        en: 'do not need to carry heavy paper books'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Đọc sách thoải mái mọi lúc mọi nơi, như trên xe buýt hay quán cà phê',
                        en: 'read anytime and anywhere easily'
                    }
                ]
            },
            {
                num: '2',
                titleVn: 'Dễ dàng truy cập',
                coreEn: 'provide easy and fast access',
                steps: [
                    {
                        role: 'Giải thích',
                        vn: 'Không cần mất công chạy ra tận nhà sách hay thư viện để tìm mua',
                        en: 'do not need to travel to bookstores or libraries'
                    },
                    {
                        role: 'Ví dụ',
                        vn: 'Chỉ cần có mạng là tìm tên sách và tải về máy trong vài phút',
                        en: 'search on the Internet and download books in minutes'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Tiết kiệm thời gian và có rất nhiều đầu sách rẻ hoặc miễn phí',
                        en: 'save time and many e-books are cheap or free'
                    }
                ]
            },
            {
                num: '3',
                titleVn: 'Kiến thức',
                coreEn: 'help people gain more knowledge',
                steps: [
                    {
                        role: 'Giải thích',
                        vn: 'Trên mạng có kho sách điện tử khổng lồ với đủ mọi lĩnh vực',
                        en: 'there are many types of e-books on different topics'
                    },
                    {
                        role: 'Ví dụ',
                        vn: 'Từ sách học tiếng Anh, nấu ăn, kỹ năng mềm cho đến tiểu thuyết',
                        en: 'books about learning English, cooking, life skills, or novels'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Người đọc dễ dàng tìm tòi và học thêm nhiều điều bổ ích mỗi ngày',
                        en: 'learn many new and useful things every day'
                    }
                ]
            }
        ]),
        sample: [
            {
                en: "Today, I'd like to talk about e-books.",
                vn: "Hôm nay, tôi muốn nói về sách điện tử."
            },
            {
                en: "Firstly, e-books are very convenient. This is because people can read them anytime and anywhere using their phones, tablets, or laptops. They do not need to carry heavy books. Therefore, e-books make reading much easier and more flexible.",
                vn: "Đầu tiên, sách điện tử rất tiện lợi. Điều này là do mọi người có thể đọc chúng bất cứ lúc nào và ở đâu bằng điện thoại, máy tính bảng hoặc máy tính xách tay. Họ không cần phải mang theo những cuốn sách nặng. Do đó, sách điện tử làm cho việc đọc trở nên dễ dàng và linh hoạt hơn nhiều."
            },
            {
                en: "Moreover, e-books provide easy access to information. People can download books from the Internet in just a few minutes. They can also search for specific information quickly.",
                vn: "Hơn nữa, sách điện tử cung cấp sự truy cập dễ dàng vào thông tin. Mọi người có thể tải sách từ Internet chỉ trong vài phút. Họ cũng có thể tìm kiếm thông tin cụ thể một cách nhanh chóng."
            },
            {
                en: "Finally, e-books help people gain more knowledge. There are many different types of e-books, such as textbooks, novels, and self-help books. This allows readers to learn many new things. For example, someone can read an e-book about learning English or improving skills.",
                vn: "Cuối cùng, sách điện tử giúp mọi người có thêm kiến thức. Có rất nhiều loại sách điện tử khác nhau, chẳng hạn như sách giáo khoa, tiểu thuyết và sách phát triển bản thân. Điều này cho phép người đọc học nhiều điều mới. Ví dụ, một người nào đó có thể đọc một cuốn sách điện tử về việc học tiếng Anh hoặc cải thiện kỹ năng."
            },
            {
                en: "To sum up, it’s true that e-books are becoming increasingly popular in today’s modern society.",
                vn: "Tóm lại, đúng là sách điện tử đang ngày càng trở nên phổ biến trong xã hội hiện đại ngày nay."
            }
        ]
    },
    {
        id: "test9",
        title: "Topic 09 ⭐",
        topic: "Responsibility plays an important role in personal and social development.",
        promptEn: generatePromptCard({
            testNumber: '09',
            topicEn: 'Responsibility plays an important role in personal and social development.',
            topicVn: 'Trách nhiệm đóng một vai trò quan trọng trong sự phát triển cá nhân và xã hội.',
            centerEn: 'Responsibility',
            centerVn: 'Trách nhiệm',
            idea1: { en: 'Achieve high results', vn: 'Đạt kết quả cao', tag: 'Động từ' },
            idea2: { en: 'Gain trust from others', vn: 'Nhận được sự tin tưởng từ người khác', tag: 'Động từ' },
            idea3: { en: 'Improve teamwork skills', vn: 'Cải thiện kỹ năng làm việc nhóm', tag: 'Động từ' }
        }),
        promptVn: `<strong>Chủ đề:</strong> Trách nhiệm đóng một vai trò quan trọng trong sự phát triển cá nhân và xã hội.<br>`,
        vocab: generateIdeaExpansion([
            {
                num: '1',
                titleVn: 'Đạt kết quả cao',
                coreEn: 'help people achieve high results',
                steps: [
                    {
                        role: 'Giải thích',
                        vn: 'Người có trách nhiệm luôn làm việc nghiêm túc, không làm cho có',
                        en: 'always take their study and work seriously'
                    },
                    {
                        role: 'Ví dụ',
                        vn: 'Cố gắng hoàn thành bài tập hay công việc thật kỹ và đúng hạn',
                        en: 'try their best to finish tasks carefully and on time'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Đạt điểm cao ở trường hoặc có thành tích tốt trong công việc',
                        en: 'get good grades at school and better results at work'
                    }
                ]
            },
            {
                num: '2',
                titleVn: 'Nhận được sự tin tưởng từ người khác',
                coreEn: 'gain trust from people around them',
                steps: [
                    {
                        role: 'Giải thích',
                        vn: 'Họ luôn biết giữ lời hứa và làm tròn phần việc đã nhận',
                        en: 'always keep promises and do their duties well'
                    },
                    {
                        role: 'Chi tiết',
                        vn: 'Bạn bè, thầy cô hay cấp trên đều yên tâm khi giao việc quan trọng',
                        en: 'friends, teachers, and bosses feel safe giving them tasks'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Được quý mến và có nhiều cơ hội phát triển tốt hơn',
                        en: 'get more good opportunities in study and work'
                    }
                ]
            },
            {
                num: '3',
                titleVn: 'Cải thiện kỹ năng làm việc nhóm',
                coreEn: 'improve teamwork skills',
                steps: [
                    {
                        role: 'Giải thích',
                        vn: 'Trong nhóm, ai cũng tự giác hoàn thành tốt phần việc của mình',
                        en: 'every member does their own part well'
                    },
                    {
                        role: 'Chi tiết',
                        vn: 'Không ai phải gánh việc thay người khác hay cãi nhau vì trễ hạn',
                        en: 'no one has to do others\' work or argue about late tasks'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Cả nhóm phối hợp vui vẻ, ăn ý và đạt mục tiêu chung nhanh hơn',
                        en: 'the whole team works happily and effectively together'
                    }
                ]
            }
        ]),
        sample: [
            {
                en: "Today, I'd like to talk about responsibility.",
                vn: "Hôm nay, tôi muốn nói về trách nhiệm."
            },
            {
                en: "Firstly, responsibility helps people achieve high results. This is because responsible people always try to complete their tasks carefully and on time. They take their work seriously and do their best. Therefore, they often get good grades and better results.",
                vn: "Đầu tiên, trách nhiệm giúp mọi người đạt kết quả cao. Điều này là do những người có trách nhiệm luôn cố gắng hoàn thành nhiệm vụ của họ một cách cẩn thận và đúng hạn. Họ coi trọng công việc và làm hết sức mình. Do đó, họ thường đạt điểm cao và kết quả tốt hơn."
            },
            {
                en: "Moreover, responsibility helps people gain trust from others. When someone always keeps their promises and does their duties well, others will believe in them. As a result, that person can have more opportunities in study and work.",
                vn: "Hơn nữa, trách nhiệm giúp mọi người nhận được sự tin tưởng từ người khác. Khi một người luôn giữ lời hứa và làm tốt nhiệm vụ của mình, những người khác sẽ tin tưởng họ. Kết quả là, người đó có thể có nhiều cơ hội hơn trong học tập và công việc."
            },
            {
                en: "Finally, responsibility can improve teamwork skills. When each member in a team is responsible, the work becomes easier and more effective. Everyone does their part and supports each other. Therefore, responsibility helps teams work better together.",
                vn: "Cuối cùng, trách nhiệm có thể cải thiện kỹ năng làm việc nhóm. Khi mỗi thành viên trong một nhóm đều có trách nhiệm, công việc trở nên dễ dàng và hiệu quả hơn. Mọi người làm phần việc của mình và hỗ trợ lẫn nhau. Do đó, trách nhiệm giúp các nhóm làm việc cùng nhau tốt hơn."
            },
            {
                en: "To sum up, it’s true that responsibility plays an important role in personal and social development.",
                vn: "Tóm lại, đúng là trách nhiệm đóng một vai trò quan trọng trong sự phát triển cá nhân và xã hội."
            }
        ]
    },
    {
        id: "test10",
        title: "Topic 10 🏋️",
        topic: "Although doing exercise is generally beneficial, there are still several disadvantages.",
        promptEn: generatePromptCard({
            testNumber: '10',
            topicEn: 'Although doing exercise is generally beneficial, there are still several disadvantages.',
            topicVn: 'Mặc dù tập thể dục nói chung là có lợi, vẫn có một số nhược điểm.',
            centerEn: 'Doing exercise',
            centerVn: 'Tập thể dục',
            idea1: { en: 'Time-consuming', vn: 'Tốn thời gian', tag: 'Tính từ' },
            idea2: { en: 'Expensive', vn: 'Đắt đỏ', tag: 'Tính từ' },
            idea3: { en: 'The risk of injuries', vn: 'Nguy cơ chấn thương', tag: 'Cụm danh từ' }
        }),
        promptVn: `<strong>Chủ đề:</strong> Mặc dù tập thể dục nói chung là có lợi, vẫn có một số nhược điểm.<br>`,
        vocab: generateIdeaExpansion([
            {
                num: '1',
                titleVn: 'Tốn thời gian',
                coreEn: 'doing exercise can be time-consuming',
                steps: [
                    {
                        role: 'Giải thích',
                        vn: 'Muốn khỏe đẹp thì phải duy trì tập luyện đều đặn mỗi ngày',
                        en: 'need to spend time practicing regularly every day'
                    },
                    {
                        role: 'Chi tiết',
                        vn: 'Tốn thêm cả thời gian thay đồ, đi tới phòng tập và tắm rửa nghỉ ngơi',
                        en: 'take time to go to the gym, work out, and shower'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Người bận học hành, đi làm rất khó sắp xếp được thời gian trống',
                        en: 'busy people find it hard to balance their schedule'
                    }
                ]
            },
            {
                num: '2',
                titleVn: 'Đắt đỏ',
                coreEn: 'it can cost quite a lot of money',
                steps: [
                    {
                        role: 'Giải thích',
                        vn: 'Nhiều bộ môn thể thao hoặc phòng tập đòi hỏi chi phí không hề rẻ',
                        en: 'many gyms and sports activities require money'
                    },
                    {
                        role: 'Ví dụ',
                        vn: 'Phải đóng thẻ tập gym hằng tháng, mua giày êm và quần áo thể thao',
                        en: 'pay monthly gym fees and buy sports shoes and clothes'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Khá tốn kém đối với học sinh, sinh viên hay người thu nhập thấp',
                        en: 'quite expensive for students or low-income people'
                    }
                ]
            },
            {
                num: '3',
                titleVn: 'Nguy cơ chấn thương',
                coreEn: 'there is a risk of getting hurt',
                steps: [
                    {
                        role: 'Giải thích',
                        vn: 'Nếu tập sai động tác, quên khởi động kỹ hoặc cố tập quá sức',
                        en: 'do not warm up well or push themselves too hard'
                    },
                    {
                        role: 'Ví dụ',
                        vn: 'Rất dễ bị căng cơ, đau khớp khi nâng tạ nặng hay chơi bóng đá',
                        en: 'hurt their muscles or joints when lifting weights or playing sports'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Bị đau nhức và ảnh hưởng tới việc đi lại, sinh hoạt hằng ngày',
                        en: 'feel painful and affect daily life and work'
                    }
                ]
            }
        ]),
        sample: [
            {
                en: "Today, I'd like to talk about doing exercise.",
                vn: "Hôm nay, tôi muốn nói về việc tập thể dục."
            },
            {
                en: "Firstly, doing exercise can be time-consuming. This is because people need to spend a certain amount of time every day practicing regularly. Therefore, some people find it difficult to balance exercise with their daily schedule.",
                vn: "Đầu tiên, tập thể dục có thể tốn thời gian. Điều này là do mọi người cần dành một khoảng thời gian nhất định mỗi ngày để tập luyện thường xuyên. Do đó, một số người thấy khó khăn trong việc cân bằng việc tập thể dục với lịch trình hàng ngày của họ."
            },
            {
                en: "Moreover, doing exercise can be expensive. Some activities require money for equipment, gym memberships, or training classes. For example, people may need to pay monthly fees to go to the gym or buy sports clothes and shoes.",
                vn: "Hơn nữa, tập thể dục có thể đắt đỏ. Một số hoạt động đòi hỏi tiền cho thiết bị, thẻ thành viên phòng tập, hoặc các lớp huấn luyện. Ví dụ, mọi người có thể cần phải trả phí hàng tháng để đến phòng tập hoặc mua quần áo và giày thể thao."
            },
            {
                en: "Finally, there is a risk of injuries when doing exercise. If people do not exercise properly or push themselves too hard, they can get hurt. For example, someone may hurt their muscles or joints while lifting heavy weights or playing sports.",
                vn: "Cuối cùng, có nguy cơ chấn thương khi tập thể dục. Nếu mọi người không tập thể dục đúng cách hoặc ép bản thân quá mức, họ có thể bị thương. Ví dụ, một người nào đó có thể làm tổn thương cơ hoặc khớp của họ trong khi nâng tạ nặng hoặc chơi thể thao."
            },
            {
                en: "To sum up, although doing exercise is beneficial, it still has several disadvantages.",
                vn: "Tóm lại, mặc dù tập thể dục có lợi, nó vẫn có một số nhược điểm."
            }
        ]
    },
    {
        id: "test11",
        title: "Topic 11 👩",
        topic: "Women should be encouraged to become leaders.",
        promptEn: generatePromptCard({
            testNumber: '11',
            topicEn: 'Women should be encouraged to become leaders.',
            topicVn: 'Phụ nữ nên được khuyến khích trở thành những nhà lãnh đạo.',
            centerEn: 'Women',
            centerVn: 'Phụ nữ',
            idea1: { en: 'Good communication', vn: 'Giao tiếp tốt', tag: 'Cụm danh từ' },
            idea2: { en: 'Careful decision making', vn: 'Ra quyết định cẩn thận', tag: 'Cụm danh từ' },
            idea3: { en: 'Multitasking skills', vn: 'Kỹ năng đa nhiệm', tag: 'Cụm danh từ' }
        }),
        promptVn: `<strong>Chủ đề:</strong> Phụ nữ nên được khuyến khích trở thành những nhà lãnh đạo.<br>`,
        vocab: generateIdeaExpansion({
            b1: [
                {
                    num: '1',
                    titleVn: 'Giao tiếp tốt',
                    coreEn: 'women often have good communication skills',
                    steps: [
                        {
                            role: 'Giải thích',
                            vn: 'Dễ dàng nói chuyện với người khác',
                            en: 'talk to other people easily'
                        },
                        {
                            role: 'Chi tiết',
                            vn: 'Hiểu được cảm xúc của họ',
                            en: 'understand their feelings'
                        },
                        {
                            role: 'Kết quả',
                            vn: 'Giúp làm việc tốt với nhóm và giải quyết các vấn đề',
                            en: 'work well with their team and solve problems'
                        }
                    ]
                },
                {
                    num: '2',
                    titleVn: 'Ra quyết định cẩn thận',
                    coreEn: 'women can make careful decisions',
                    steps: [
                        {
                            role: 'Giải thích',
                            vn: 'Trước khi quyết định, thường suy nghĩ về các lựa chọn khác nhau',
                            en: 'before making a decision, think about different choices'
                        },
                        {
                            role: 'Chi tiết',
                            vn: 'Nghĩ về những kết quả có thể xảy ra',
                            en: 'think about possible results'
                        },
                        {
                            role: 'Kết quả',
                            vn: 'Giúp công ty của họ tránh được các vấn đề',
                            en: 'help their companies avoid problems'
                        }
                    ]
                },
                {
                    num: '3',
                    titleVn: 'Kỹ năng đa nhiệm',
                    coreEn: 'women are good at doing many things at the same time',
                    steps: [
                        {
                            role: 'Ví dụ',
                            vn: 'Có thể tham dự các cuộc họp và quản lý công việc',
                            en: 'attend meetings and manage their work'
                        },
                        {
                            role: 'Chi tiết',
                            vn: 'Đồng thời giúp đỡ các thành viên trong nhóm',
                            en: 'help their team members'
                        },
                        {
                            role: 'Kết quả',
                            vn: 'Đây là một phẩm chất quan trọng đối với một nhà lãnh đạo',
                            en: 'an important quality for a leader'
                        }
                    ]
                }
            ],
            b2: [
                {
                    num: '1',
                    titleVn: 'Giao tiếp tốt',
                    coreEn: 'women often have excellent communication skills',
                    steps: [
                        {
                            role: 'Giải thích',
                            vn: 'Biết lắng nghe người khác, chia sẻ ý tưởng và cân nhắc các ý kiến khác nhau',
                            en: 'listen to others, share their ideas and consider different opinions'
                        },
                        {
                            role: 'Kết quả',
                            vn: 'Xây dựng mối quan hệ tốt với các thành viên trong nhóm',
                            en: 'build good relationships with their team members'
                        },
                        {
                            role: 'Tác động',
                            vn: 'Tạo ra một môi trường làm việc thân thiện',
                            en: 'create a friendly working environment'
                        }
                    ]
                },
                {
                    num: '2',
                    titleVn: 'Ra quyết định cẩn thận',
                    coreEn: 'women are often careful when making decisions',
                    steps: [
                        {
                            role: 'Giải thích',
                            vn: 'Thường xem xét các phương án khác nhau trước khi hành động',
                            en: 'consider different options before taking action'
                        },
                        {
                            role: 'Chi tiết',
                            vn: 'Suy nghĩ về những kết quả có thể xảy ra',
                            en: 'think about the possible results'
                        },
                        {
                            role: 'Kết quả',
                            vn: 'Tránh sai lầm không đáng có và chọn giải pháp tốt nhất cho nhóm hoặc công ty',
                            en: 'avoid unnecessary mistakes and choose the best solutions for their teams or companies'
                        }
                    ]
                },
                {
                    num: '3',
                    titleVn: 'Kỹ năng đa nhiệm',
                    coreEn: 'women are often good at multitasking',
                    steps: [
                        {
                            role: 'Giải thích',
                            vn: 'Quản lý các nhiệm vụ khác nhau, giải quyết vấn đề và hỗ trợ thành viên cùng lúc',
                            en: 'manage different tasks, solve problems and support their team members at the same time'
                        },
                        {
                            role: 'Ví dụ',
                            vn: 'Một nữ quản lý có thể phải dự họp, kiểm tra việc của nhóm và làm việc với khách hàng trong cùng một ngày',
                            en: 'attend meetings, check her team\'s work and deal with customers on the same day'
                        },
                        {
                            role: 'Kết quả',
                            vn: 'Đây là một phẩm chất quan trọng của một người lãnh đạo',
                            en: 'an important quality of a leader'
                        }
                    ]
                }
            ]
        }),
        sample: {
            b1: [
                {
                    en: "Today, I’d like to talk about the reasons why I agree that women should be encouraged to become leaders.",
                    vn: "Hôm nay, tôi muốn nói về những lý do tại sao tôi đồng ý rằng phụ nữ nên được khuyến khích trở thành những nhà lãnh đạo."
                },
                {
                    en: "Firstly, women often have good communication skills. They can talk to other people easily and understand their feelings. This helps them work well with their team and solve problems.",
                    vn: "Đầu tiên, phụ nữ thường có kỹ năng giao tiếp tốt. Họ có thể nói chuyện với người khác một cách dễ dàng và hiểu được cảm xúc của họ. Điều này giúp họ làm việc tốt với nhóm của mình và giải quyết các vấn đề."
                },
                {
                    en: "Secondly, women can make careful decisions. Before making a decision, they often think about different choices and possible results. This can help their companies avoid problems.",
                    vn: "Thứ hai, phụ nữ có thể đưa ra những quyết định cẩn thận. Trước khi đưa ra quyết định, họ thường suy nghĩ về các lựa chọn khác nhau và những kết quả có thể xảy ra. Điều này có thể giúp công ty của họ tránh được các vấn đề."
                },
                {
                    en: "Finally, women are good at doing many things at the same time. For example, they can attend meetings, manage their work and help their team members. This is an important quality for a leader.",
                    vn: "Cuối cùng, phụ nữ giỏi làm nhiều việc cùng một lúc. Ví dụ, họ có thể tham dự các cuộc họp, quản lý công việc và giúp đỡ các thành viên trong nhóm. Đây là một phẩm chất quan trọng đối với một người lãnh đạo."
                },
                {
                    en: "In conclusion, it’s true that women should be encouraged to become leaders.",
                    vn: "Tóm lại, đúng là phụ nữ nên được khuyến khích trở thành những nhà lãnh đạo."
                }
            ],
            b2: [
                {
                    en: "Today, I’d like to talk about the reasons why women should be encouraged to take on leadership positions.",
                    vn: "Hôm nay, tôi muốn nói về những lý do tại sao phụ nữ nên được khuyến khích đảm nhận các vị trí lãnh đạo."
                },
                {
                    en: "First of all, women often have excellent communication skills. They know how to listen to others, share their ideas and consider different opinions. As a result, they can build good relationships with their team members and create a friendly working environment.",
                    vn: "Trước hết, phụ nữ thường có kỹ năng giao tiếp xuất sắc. Họ biết cách lắng nghe người khác, chia sẻ ý tưởng của mình và cân nhắc các ý kiến khác nhau. Kết quả là, họ có thể xây dựng mối quan hệ tốt đẹp với các thành viên trong nhóm và tạo ra một môi trường làm việc thân thiện."
                },
                {
                    en: "Another reason is that women are often careful when making decisions. They usually consider different options and think about the possible results before taking action. This helps them avoid unnecessary mistakes and choose the best solutions for their teams or companies.",
                    vn: "Một lý do khác là phụ nữ thường cẩn thận khi đưa ra quyết định. Họ thường xem xét các phương án khác nhau và suy nghĩ về những kết quả có thể xảy ra trước khi hành động. Điều này giúp họ tránh được những sai lầm không đáng có và lựa chọn những giải pháp tốt nhất cho nhóm hoặc công ty của mình."
                },
                {
                    en: "Finally, women are often good at multitasking. They can manage different tasks, solve problems and support their team members at the same time. For example, a female manager may have to attend meetings, check her team's work and deal with customers on the same day. This is an important quality of a leader.",
                    vn: "Cuối cùng, phụ nữ thường giỏi làm nhiều việc cùng lúc. Họ có thể quản lý các nhiệm vụ khác nhau, giải quyết vấn đề và hỗ trợ các thành viên trong nhóm cùng một lúc. Ví dụ, một nữ quản lý có thể phải tham dự các cuộc họp, kiểm tra công việc của nhóm và làm việc với khách hàng trong cùng một ngày. Đây là một phẩm chất quan trọng của một người lãnh đạo."
                },
                {
                    en: "In conclusion, I strongly believe that women should be given more opportunities to become leaders.",
                    vn: "Tóm lại, tôi hoàn toàn tin rằng phụ nữ nên được trao nhiều cơ hội hơn để trở thành những nhà lãnh đạo."
                }
            ]
        }
    },
    {
        id: "test12",
        title: "Topic 12 💔",
        topic: "There are several reasons for divorce.",
        promptEn: generatePromptCard({
            testNumber: '12',
            topicEn: 'There are several reasons for divorce.',
            topicVn: 'Có một vài lý do dẫn đến ly hôn.',
            centerEn: 'Divorce',
            centerVn: 'Ly hôn',
            idea1: { en: 'Lack of responsibility', vn: 'Thiếu trách nhiệm', tag: 'Cụm danh từ' },
            idea2: { en: 'Financial burden', vn: 'Gánh nặng tài chính', tag: 'Cụm danh từ' },
            idea3: { en: 'Communication problems', vn: 'Vấn đề giao tiếp', tag: 'Cụm danh từ' }
        }),
        promptVn: `<strong>Chủ đề:</strong> Có một vài lý do dẫn đến ly hôn.<br>`,
        vocab: generateIdeaExpansion([
            {
                num: '1',
                titleVn: 'Thiếu trách nhiệm',
                coreEn: 'lack of responsibility in family life',
                steps: [
                    {
                        role: 'Giải thích',
                        vn: 'Một trong hai người thờ ơ, không chịu chăm lo cho tổ ấm chung',
                        en: 'one partner does not care about the family'
                    },
                    {
                        role: 'Ví dụ',
                        vn: 'Bỏ bê việc nhà và đẩy hết chuyện chăm con cho vợ hoặc chồng',
                        en: 'ignore housework and leave childcare to the other'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Người còn lại quá mệt mỏi, chán nản nên hôn nhân dễ đổ vỡ',
                        en: 'feel too tired and disappointed, leading to divorce'
                    }
                ]
            },
            {
                num: '2',
                titleVn: 'Gánh nặng tài chính',
                coreEn: 'money problems create big stress',
                steps: [
                    {
                        role: 'Lý do',
                        vn: 'Cuộc sống gia đình có rất nhiều khoản chi tiêu phải lo mỗi tháng',
                        en: 'married life has many bills to pay every month'
                    },
                    {
                        role: 'Ví dụ',
                        vn: 'Khi thiếu tiền lo ăn học cho con hoặc nợ nần, vợ chồng rất dễ cãi vã',
                        en: 'when lacking money for kids or bills, couples argue a lot'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Áp lực tiền bạc kéo dài làm rạn nứt hạnh phúc gia đình',
                        en: 'money stress damages their relationship'
                    }
                ]
            },
            {
                num: '3',
                titleVn: 'Vấn đề giao tiếp',
                coreEn: 'fail to communicate well with each other',
                steps: [
                    {
                        role: 'Giải thích',
                        vn: 'Vợ chồng ít tâm sự, không chịu lắng nghe hoặc hay nói lời nặng nề',
                        en: 'rarely talk openly or do not listen to each other'
                    },
                    {
                        role: 'Chi tiết',
                        vn: 'Những hiểu lầm nhỏ tích tụ lâu ngày biến thành mâu thuẫn lớn',
                        en: 'small misunderstandings turn into big conflicts'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Tình cảm phai nhạt dần và cuối cùng chọn đường ai nấy đi',
                        en: 'become distant over time and end in divorce'
                    }
                ]
            }
        ]),
        sample: [
            {
                en: "Today, I'd like to talk about divorce.",
                vn: "Hôm nay, tôi muốn nói về ly hôn."
            },
            {
                en: "Firstly, one main reason for divorce is a lack of responsibility. This is because when one or both partners do not take care of their duties, problems can happen. They may not support each other or take care of the family.",
                vn: "Đầu tiên, một lý do chính dẫn đến ly hôn là sự thiếu trách nhiệm. Điều này là do khi một hoặc cả hai đối tác không chăm lo cho nhiệm vụ của họ, các vấn đề có thể xảy ra. Họ có thể không hỗ trợ lẫn nhau hoặc chăm sóc gia đình."
            },
            {
                en: "Moreover, another common cause is financial burden. Money problems can create a lot of pressure in a marriage. If a couple does not have enough money or spends too much, they may argue frequently. As a result, financial stress can damage the relationship.",
                vn: "Hơn nữa, một nguyên nhân phổ biến khác là gánh nặng tài chính. Các vấn đề về tiền bạc có thể tạo ra nhiều áp lực trong một cuộc hôn nhân. Nếu một cặp vợ chồng không có đủ tiền hoặc chi tiêu quá nhiều, họ có thể tranh cãi thường xuyên. Kết quả là, căng thẳng tài chính có thể làm hỏng mối quan hệ."
            },
            {
                en: "Finally, communication problems can also lead to divorce. When couples do not talk openly or do not understand each other, conflicts can happen. Therefore, the relationship becomes weaker over time and may end in divorce.",
                vn: "Cuối cùng, các vấn đề về giao tiếp cũng có thể dẫn đến ly hôn. Khi các cặp vợ chồng không nói chuyện cởi mở hoặc không hiểu nhau, các xung đột có thể xảy ra. Do đó, mối quan hệ trở nên yếu đi theo thời gian và có thể kết thúc bằng việc ly hôn."
            },
            {
                en: "To sum up, it’s true that there are several reasons for divorce.",
                vn: "Tóm lại, đúng là có một vài lý do dẫn đến ly hôn."
            }
        ]
    },
    {
        id: "test13",
        title: "Topic 13 👔",
        topic: "There are several factors to consider in order to make a good impression in an interview.",
        promptEn: generatePromptCard({
            testNumber: '13',
            topicEn: 'There are several factors to consider in order to make a good impression in an interview.',
            topicVn: 'Có một số yếu tố cần xem xét để tạo ấn tượng tốt trong một cuộc phỏng vấn.',
            centerEn: 'Job interviews',
            centerVn: 'Phỏng vấn xin việc',
            idea1: { en: 'Preparation', vn: 'Sự chuẩn bị', tag: 'Danh từ' },
            idea2: { en: 'Communication skills', vn: 'Kỹ năng giao tiếp', tag: 'Cụm danh từ' },
            idea3: { en: 'Appearance', vn: 'Ngoại hình', tag: 'Danh từ' }
        }),
        promptVn: `<strong>Chủ đề:</strong> Có một số yếu tố cần xem xét để tạo ấn tượng tốt trong một cuộc phỏng vấn.<br>`,
        vocab: generateIdeaExpansion([
            {
                num: '1',
                titleVn: 'Sự chuẩn bị',
                coreEn: 'prepare carefully before the interview',
                steps: [
                    {
                        role: 'Giải thích',
                        vn: 'Tìm hiểu trước thông tin về công ty và vị trí công việc mình nộp đơn',
                        en: 'learn about the company and the job beforehand'
                    },
                    {
                        role: 'Ví dụ',
                        vn: 'Tập trả lời ở nhà các câu hỏi quen thuộc như giới thiệu bản thân',
                        en: 'practice answering common questions at home'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Bước vào phòng phỏng vấn tự tin hơn, không bị run hay ấp úng',
                        en: 'feel much more confident and speak smoothly'
                    }
                ]
            },
            {
                num: '2',
                titleVn: 'Kỹ năng giao tiếp',
                coreEn: 'show good communication skills',
                steps: [
                    {
                        role: 'Giải thích',
                        vn: 'Trình bày ý rõ ràng, lễ phép và giữ ánh mắt tự nhiên với người hỏi',
                        en: 'speak clearly, politely, and make eye contact'
                    },
                    {
                        role: 'Chi tiết',
                        vn: 'Chăm chú lắng nghe câu hỏi để trả lời đúng trọng tâm',
                        en: 'listen carefully to answer right to the point'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Tạo thiện cảm lớn với nhà tuyển dụng ngay từ buổi gặp đầu tiên',
                        en: 'make a great impression on the interviewer'
                    }
                ]
            },
            {
                num: '3',
                titleVn: 'Ngoại hình',
                coreEn: 'have a neat and polite appearance',
                steps: [
                    {
                        role: 'Lý do',
                        vn: 'Vẻ bề ngoài là điều đầu tiên nhà tuyển dụng nhìn thấy khi bạn bước vào',
                        en: 'the first thing interviewers see when you walk in'
                    },
                    {
                        role: 'Ví dụ',
                        vn: 'Mặc quần áo sạch sẽ, lịch sự, đầu tóc gọn gàng và tươi cười',
                        en: 'wear clean, formal clothes and smile nicely'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Thể hiện sự tôn trọng công ty và tăng cơ hội được nhận việc',
                        en: 'show respect and increase the chance of getting hired'
                    }
                ]
            }
        ]),
        sample: [
            {
                en: "Today, I'd like to talk about job interviews.",
                vn: "Hôm nay, tôi muốn nói về các cuộc phỏng vấn xin việc."
            },
            {
                en: "Firstly, one factor to have a successful interview is preparation. This is because candidates need to understand the job and the company before the interview. They should also prepare answers for common questions.",
                vn: "Đầu tiên, một yếu tố để có một cuộc phỏng vấn thành công là sự chuẩn bị. Điều này là do các ứng viên cần hiểu công việc và công ty trước cuộc phỏng vấn. Họ cũng nên chuẩn bị câu trả lời cho các câu hỏi phổ biến."
            },
            {
                en: "Moreover, another important factor is communication skills. During the interview, candidates need to express their ideas clearly and confidently. They should speak politely and listen carefully to the interviewer.",
                vn: "Hơn nữa, một yếu tố quan trọng khác là kỹ năng giao tiếp. Trong quá trình phỏng vấn, các ứng viên cần bày tỏ ý tưởng của họ một cách rõ ràng và tự tin. Họ nên nói năng lịch sự và lắng nghe cẩn thận người phỏng vấn."
            },
            {
                en: "Finally, appearance also plays an important role. For example, wearing clean and formal clothes shows respect and a professional attitude. Therefore, a good appearance can increase the chances of success in an interview.",
                vn: "Cuối cùng, ngoại hình cũng đóng một vai trò quan trọng. Ví dụ, mặc quần áo sạch sẽ và trang trọng thể hiện sự tôn trọng và thái độ chuyên nghiệp. Do đó, một ngoại hình tốt có thể tăng cơ hội thành công trong một cuộc phỏng vấn."
            },
            {
                en: "To sum up, it’s true that there are several factors to consider in order to make a good impression in an interview.",
                vn: "Tóm lại, đúng là có một số yếu tố cần xem xét để tạo ấn tượng tốt trong một cuộc phỏng vấn."
            }
        ]
    },
    {
        id: "test14",
        title: "Topic 14 🌳",
        topic: "Trees bring many benefits to people and the environment.",
        promptEn: generatePromptCard({
            testNumber: '14',
            topicEn: 'Trees bring many benefits to people and the environment.',
            topicVn: 'Cây cối mang lại nhiều lợi ích cho con người và môi trường.',
            centerEn: 'Benefits of trees',
            centerVn: 'Lợi ích của cây cối',
            idea1: { en: 'Food', vn: 'Thức ăn', tag: 'Danh từ' },
            idea2: { en: 'Environmental protection', vn: 'Bảo vệ môi trường', tag: 'Cụm danh từ' },
            idea3: { en: 'Flood prevention', vn: 'Ngăn ngừa lũ lụt', tag: 'Cụm danh từ' }
        }),
        promptVn: `<strong>Chủ đề:</strong> Cây cối mang lại nhiều lợi ích cho con người và môi trường.<br>`,
        vocab: generateIdeaExpansion([
            {
                num: '1',
                titleVn: 'Thức ăn',
                coreEn: 'provide fresh food for people and animals',
                steps: [
                    {
                        role: 'Giải thích',
                        vn: 'Nhiều loài cây cho chúng ta nguồn thực phẩm tự nhiên giàu vitamin',
                        en: 'many trees give us healthy fruits, nuts, and leaves'
                    },
                    {
                        role: 'Ví dụ',
                        vn: 'Các cây quen thuộc như xoài, chuối, cam, dừa cho trái ngon quanh năm',
                        en: 'mango, banana, and coconut trees give delicious fruits'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Cung cấp bữa ăn hằng ngày và giúp người trồng cây có thêm thu nhập',
                        en: 'provide daily food and help farmers earn money'
                    }
                ]
            },
            {
                num: '2',
                titleVn: 'Bảo vệ môi trường',
                coreEn: 'help protect our environment',
                steps: [
                    {
                        role: 'Giải thích',
                        vn: 'Cây xanh hút khí độc hại và nhả ra khí oxy trong lành để thở',
                        en: 'absorb bad gas and give out fresh oxygen'
                    },
                    {
                        role: 'Chi tiết',
                        vn: 'Tán cây rộng còn che nắng, tỏa bóng mát cho đường phố',
                        en: 'provide cool shade on hot sunny days'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Làm bầu không khí sạch hơn và thời tiết dịu mát hơn nhiều',
                        en: 'make the air cleaner and the weather cooler'
                    }
                ]
            },
            {
                num: '3',
                titleVn: 'Ngăn ngừa lũ lụt',
                coreEn: 'help prevent floods in rainy seasons',
                steps: [
                    {
                        role: 'Giải thích',
                        vn: 'Bộ rễ cây đâm sâu giúp giữ chặt đất và hút bớt nước mưa',
                        en: 'tree roots hold the soil and absorb rainwater'
                    },
                    {
                        role: 'Chi tiết',
                        vn: 'Khi mưa bão lớn, rừng cây cản bớt sức nước không chảy tràn quá nhanh',
                        en: 'stop heavy rainwater from flowing too fast'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Giảm thiệt hại do lũ lụt, sạt lở và bảo vệ nhà cửa người dân',
                        en: 'reduce floods and protect people\'s homes'
                    }
                ]
            }
        ]),
        sample: [
            {
                en: "Today, I'd like to talk about the benefits of trees.",
                vn: "Hôm nay, tôi muốn nói về những lợi ích của cây cối."
            },
            {
                en: "Firstly, trees can provide food for people and animals. This is because many trees give us fruits, nuts, and leaves that we can eat. For example, mango trees, coconut trees, and banana trees are very useful in daily life.",
                vn: "Đầu tiên, cây cối có thể cung cấp thức ăn cho con người và động vật. Điều này là do nhiều loại cây cho chúng ta trái cây, hạt và lá mà chúng ta có thể ăn được. Ví dụ, cây xoài, cây dừa và cây chuối rất hữu ích trong cuộc sống hàng ngày."
            },
            {
                en: "Moreover, trees help protect the environment. They can make the air cleaner because they absorb carbon dioxide and release oxygen. Trees also provide shade and make the weather cooler, especially in big cities.",
                vn: "Hơn nữa, cây cối giúp bảo vệ môi trường. Chúng có thể làm cho không khí sạch hơn vì chúng hấp thụ khí carbon dioxide và thải ra oxy. Cây cối cũng cung cấp bóng râm và làm cho thời tiết mát mẻ hơn, đặc biệt là ở các thành phố lớn."
            },
            {
                en: "Finally, trees can help prevent floods. Their roots can hold the soil and absorb rainwater. When there are many trees, water does not flow too quickly, so floods can be reduced.",
                vn: "Cuối cùng, cây cối có thể giúp ngăn ngừa lũ lụt. Rễ của chúng có thể giữ đất và hấp thụ nước mưa. Khi có nhiều cây, nước không chảy quá nhanh, do đó lũ lụt có thể được giảm bớt."
            },
            {
                en: "To sum up, it’s true that trees bring many benefits to our life.",
                vn: "Tóm lại, đúng là cây cối mang lại nhiều lợi ích cho cuộc sống của chúng ta."
            }
        ]
    },
    {
        id: "test15",
        title: "Topic 15 ⚡",
        topic: "Electric cars bring many benefits to people and the environment.",
        promptEn: generatePromptCard({
            testNumber: '15',
            topicEn: 'Electric cars bring many benefits to people and the environment.',
            topicVn: 'Xe điện mang lại nhiều lợi ích cho con người và môi trường.',
            centerEn: 'Electric cars',
            centerVn: 'Xe điện',
            idea1: { en: 'Reduce pollution', vn: 'Giảm ô nhiễm', tag: 'Động từ' },
            idea2: { en: 'Save natural resources', vn: 'Tiết kiệm tài nguyên thiên nhiên', tag: 'Động từ' },
            idea3: { en: 'Save money', vn: 'Tiết kiệm tiền', tag: 'Động từ' }
        }),
        promptVn: `<strong>Chủ đề:</strong> Xe điện mang lại nhiều lợi ích cho con người và môi trường.<br>`,
        vocab: generateIdeaExpansion([
            {
                num: '1',
                titleVn: 'Giảm ô nhiễm',
                coreEn: 'help reduce air and noise pollution',
                steps: [
                    {
                        role: 'Giải thích',
                        vn: 'Xe điện chạy bằng pin nên không xả khói đen như xe xăng dầu',
                        en: 'run on batteries and produce no dirty smoke'
                    },
                    {
                        role: 'Chi tiết',
                        vn: 'Động cơ xe điện chạy rất êm ái, hầu như không gây ồn ào ngoài phố',
                        en: 'run very quietly on the streets'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Giữ bầu không khí ở các thành phố lớn trong lành, dễ thở hơn',
                        en: 'make the air in big cities much cleaner'
                    }
                ]
            },
            {
                num: '2',
                titleVn: 'Tiết kiệm tài nguyên thiên nhiên',
                coreEn: 'save limited natural resources',
                steps: [
                    {
                        role: 'Lý do',
                        vn: 'Nguồn xăng dầu trong lòng đất có hạn và ngày càng cạn dần',
                        en: 'oil and gas are limited and may run out in the future'
                    },
                    {
                        role: 'Giải thích',
                        vn: 'Xe điện dùng nguồn điện sạch thay vì phụ thuộc vào xăng dầu',
                        en: 'use electricity instead of burning gas and oil'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Bảo tồn được nguồn nhiên liệu tự nhiên cho con cháu mai sau',
                        en: 'save precious natural fuels for the future'
                    }
                ]
            },
            {
                num: '3',
                titleVn: 'Tiết kiệm tiền',
                coreEn: 'help drivers save money in the long run',
                steps: [
                    {
                        role: 'Giải thích',
                        vn: 'Giá xăng ngày càng đắt đỏ, trong khi tiền sạc điện rẻ hơn rất nhiều',
                        en: 'charging electricity is much cheaper than buying gas'
                    },
                    {
                        role: 'Chi tiết',
                        vn: 'Xe điện cũng ít tốn tiền thay nhớt hay sửa chữa lặt vặt',
                        en: 'cost less money for oil changes and repairs'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Dù mua xe ban đầu hơi cao nhưng đi lâu dài lại rất kinh tế',
                        en: 'cheaper to use and save a lot of money over time'
                    }
                ]
            }
        ]),
        sample: [
            {
                en: "Today, I'd like to talk about the benefits of electric cars.",
                vn: "Hôm nay, tôi muốn nói về lợi ích của xe điện."
            },
            {
                en: "Firstly, electric cars can help reduce pollution. This is because they do not produce smoke or harmful emissions like cars or motorbikes. As a result, the air becomes cleaner, especially in big cities where there is a lot of traffic.",
                vn: "Đầu tiên, xe điện có thể giúp giảm ô nhiễm. Điều này là do chúng không tạo ra khói hoặc khí thải độc hại như ô tô hay xe máy. Kết quả là, không khí trở nên sạch hơn, đặc biệt là ở các thành phố lớn nơi có nhiều phương tiện giao thông."
            },
            {
                en: "Moreover, electric cars can help save natural resources. In fact, cars or motorbikes use gas as fuel, which is limited and may run out in the future. Electric cars use electricity, so they can reduce our need for fossil fuels. Therefore, they are more sustainable in the long term.",
                vn: "Hơn nữa, xe điện có thể giúp tiết kiệm tài nguyên thiên nhiên. Trên thực tế, ô tô hoặc xe máy sử dụng xăng làm nhiên liệu, thứ bị giới hạn và có thể cạn kiệt trong tương lai. Xe điện sử dụng điện, vì vậy chúng có thể giảm nhu cầu của chúng ta về nhiên liệu hóa thạch. Do đó, chúng bền vững hơn về lâu dài."
            },
            {
                en: "Finally, electric cars can help people save money. Although they may be expensive at first, they are cheaper to use in the long term. Drivers do not need to spend a lot of money on fuel.",
                vn: "Cuối cùng, xe điện có thể giúp mọi người tiết kiệm tiền. Mặc dù chúng có thể đắt đỏ lúc đầu, nhưng chúng rẻ hơn khi sử dụng về lâu dài. Người lái xe không cần phải tiêu nhiều tiền cho nhiên liệu."
            },
            {
                en: "To sum up, it’s true that electric cars bring many benefits.",
                vn: "Tóm lại, đúng là xe điện mang lại nhiều lợi ích."
            }
        ]
    },
    {
        id: "test16",
        title: "Topic 16 🌍",
        topic: "There are many ways to protect the environment.",
        promptEn: generatePromptCard({
            testNumber: '16',
            topicEn: 'There are many ways to protect the environment.',
            topicVn: 'Có rất nhiều cách để bảo vệ môi trường.',
            centerEn: 'Protect the environment',
            centerVn: 'Bảo vệ môi trường',
            idea1: { en: 'Not using plastic bags', vn: 'Không sử dụng túi nilon', tag: 'Danh động từ' },
            idea2: { en: 'Using alternative energy sources', vn: 'Sử dụng các nguồn năng lượng thay thế', tag: 'Danh động từ' },
            idea3: { en: 'Using public transport', vn: 'Sử dụng phương tiện công cộng', tag: 'Danh động từ' }
        }),
        promptVn: `<strong>Chủ đề:</strong> Có rất nhiều cách để bảo vệ môi trường.<br>`,
        vocab: generateIdeaExpansion([
            {
                num: '1',
                titleVn: 'Không sử dụng túi nilon',
                coreEn: 'stop using single-use plastic bags',
                steps: [
                    {
                        role: 'Lý do',
                        vn: 'Túi nilon rất khó phân hủy, nằm lại trong đất và nước hàng trăm năm',
                        en: 'plastic bags stay in nature for hundreds of years'
                    },
                    {
                        role: 'Ví dụ',
                        vn: 'Khi đi chợ, đi siêu thị nên mang theo giỏ xách, túi vải hoặc túi giấy',
                        en: 'use cloth bags or paper bags when shopping'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Giảm đáng kể lượng rác thải nhựa làm bẩn sông hồ và biển cả',
                        en: 'reduce plastic waste in rivers and oceans'
                    }
                ]
            },
            {
                num: '2',
                titleVn: 'Sử dụng các nguồn năng lượng thay thế',
                coreEn: 'switch to clean energy sources',
                steps: [
                    {
                        role: 'Lý do',
                        vn: 'Đốt than đá hay xăng dầu thải ra rất nhiều khói bụi độc hại',
                        en: 'burning coal and oil creates a lot of dirty smoke'
                    },
                    {
                        role: 'Ví dụ',
                        vn: 'Tận dụng nguồn điện mặt trời và điện gió vì hoàn toàn tự nhiên',
                        en: 'use solar energy or wind energy instead'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Giữ bầu không khí sạch sẽ và bảo vệ nguồn tài nguyên thiên nhiên',
                        en: 'keep the air clean and protect natural resources'
                    }
                ]
            },
            {
                num: '3',
                titleVn: 'Sử dụng phương tiện công cộng',
                coreEn: 'travel by public transport more often',
                steps: [
                    {
                        role: 'Giải thích',
                        vn: 'Mọi người đi làm, đi học bằng xe buýt hoặc tàu điện thay vì xe riêng',
                        en: 'take buses or trains instead of private cars and motorbikes'
                    },
                    {
                        role: 'Chi tiết',
                        vn: 'Xe cộ cá nhân ngoài đường ít đi thì lượng khói bụi cũng giảm hẳn',
                        en: 'fewer private vehicles on the road mean less smoke'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Vừa giảm ô nhiễm không khí, vừa bớt cảnh tắc đường giờ cao điểm',
                        en: 'reduce both air pollution and traffic jams'
                    }
                ]
            }
        ]),
        sample: [
            {
                en: "Today, I'd like to talk about some solutions to protect the environment.",
                vn: "Hôm nay, tôi muốn nói về một số giải pháp để bảo vệ môi trường."
            },
            {
                en: "Firstly, people should not use plastic bags. This is because plastic bags are very hard to decompose. They can stay in the environment for many years and pollute rivers, oceans, and soil. Instead, people can use paper bags when they go shopping.",
                vn: "Đầu tiên, mọi người không nên sử dụng túi nilon. Điều này là do túi nilon rất khó phân hủy. Chúng có thể tồn tại trong môi trường trong nhiều năm và làm ô nhiễm sông, đại dương, và đất. Thay vào đó, mọi người có thể sử dụng túi giấy khi đi mua sắm."
            },
            {
                en: "Moreover, another solution is using alternative energy sources. For example, we can use solar energy or wind energy instead of fossil fuels. These sources of energy are cleaner and better for the environment. They can help reduce air pollution and protect natural resources.",
                vn: "Hơn nữa, một giải pháp khác là sử dụng các nguồn năng lượng thay thế. Ví dụ, chúng ta có thể sử dụng năng lượng mặt trời hoặc năng lượng gió thay vì nhiên liệu hóa thạch. Những nguồn năng lượng này sạch hơn và tốt hơn cho môi trường. Chúng có thể giúp giảm ô nhiễm không khí và bảo vệ tài nguyên thiên nhiên."
            },
            {
                en: "Finally, people should use public transport more often. If more people travel by bus or train, there will be fewer private cars and motorbikes on the road. As a result, the air will be cleaner and traffic jams can also be reduced.",
                vn: "Cuối cùng, mọi người nên sử dụng phương tiện công cộng thường xuyên hơn. Nếu có nhiều người đi lại bằng xe buýt hoặc tàu hỏa, sẽ có ít ô tô và xe máy cá nhân trên đường hơn. Kết quả là, không khí sẽ sạch hơn và ùn tắc giao thông cũng có thể được giảm bớt."
            },
            {
                en: "To sum up, it’s true that there are many ways to protect the environment.",
                vn: "Tóm lại, đúng là có nhiều cách để bảo vệ môi trường."
            }
        ]
    },
    {
        id: "test17",
        title: "Topic 17 🎓",
        topic: "Nowadays, many university students both study and work at the same time due to several reasons.",
        promptEn: generatePromptCard({
            testNumber: '17',
            topicEn: 'Nowadays, many university students both study and work at the same time due to several reasons.',
            topicVn: 'Ngày nay, nhiều sinh viên đại học vừa học vừa làm vì một số lý do.',
            centerEn: 'Study and work',
            centerVn: 'Vừa học vừa làm',
            idea1: { en: 'Cover living costs', vn: 'Trang trải chi phí sinh hoạt', tag: 'Động từ' },
            idea2: { en: 'Enhance time-management ability', vn: 'Nâng cao khả năng quản lý thời gian', tag: 'Động từ' },
            idea3: { en: 'Gain social experience', vn: 'Tích lũy kinh nghiệm xã hội', tag: 'Động từ' }
        }),
        promptVn: `<strong>Chủ đề:</strong> Ngày nay, nhiều sinh viên đại học vừa học vừa làm vì một số lý do.<br>`,
        vocab: generateIdeaExpansion([
            {
                num: '1',
                titleVn: 'Trang trải chi phí sinh hoạt',
                coreEn: 'earn money to cover daily living costs',
                steps: [
                    {
                        role: 'Lý do',
                        vn: 'Sinh viên xa nhà phải lo đủ khoản như tiền trọ, ăn uống, học phí',
                        en: 'need money for rent, food, books, and school fees'
                    },
                    {
                        role: 'Ví dụ',
                        vn: 'Đi làm thêm ở quán cà phê, cửa hàng hoặc đi dạy kèm buổi tối',
                        en: 'work part-time at a cafe, a shop, or tutor kids'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Tự chi trả sinh hoạt cá nhân và đỡ đần gánh nặng tiền bạc cho bố mẹ',
                        en: 'pay their own bills and reduce money stress on parents'
                    }
                ]
            },
            {
                num: '2',
                titleVn: 'Nâng cao khả năng quản lý thời gian',
                coreEn: 'learn to manage time much better',
                steps: [
                    {
                        role: 'Giải thích',
                        vn: 'Vừa phải lên lớp ở trường, vừa đi làm đúng ca nên lịch trình rất kín',
                        en: 'busy with both university classes and work shifts'
                    },
                    {
                        role: 'Chi tiết',
                        vn: 'Phải biết sắp xếp giờ học, làm bài tập và nghỉ ngơi sao cho hợp lý',
                        en: 'plan their study, homework, and rest carefully'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Bỏ được thói quen lề mề, sống ngăn nắp và có kỷ luật hơn',
                        en: 'stop wasting time and become more organized'
                    }
                ]
            },
            {
                num: '3',
                titleVn: 'Tích lũy kinh nghiệm xã hội',
                coreEn: 'gain useful social experience',
                steps: [
                    {
                        role: 'Giải thích',
                        vn: 'Bước ra đi làm được tiếp xúc thực tế với nhiều khách hàng và đồng nghiệp',
                        en: 'meet and talk with many customers and coworkers'
                    },
                    {
                        role: 'Chi tiết',
                        vn: 'Học cách giao tiếp khéo léo và bình tĩnh xử lý tình huống phát sinh',
                        en: 'learn how to communicate well and solve real problems'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Mạnh dạn, tự tin hơn và dễ xin việc tốt sau khi tốt nghiệp',
                        en: 'become more confident and find a good job easily later'
                    }
                ]
            }
        ]),
        sample: [
            {
                en: "Today, I'd like to talk about why many university students study and work at the same time.",
                vn: "Hôm nay, tôi muốn nói về lý do tại sao nhiều sinh viên đại học vừa học vừa làm."
            },
            {
                en: "Firstly, having a part-time job can help students cover their living costs. This is because many students need money for food, rent, transportation, and tuition fee. When they can earn some money by themselves, they can reduce the financial pressure on their parents.",
                vn: "Đầu tiên, việc có một công việc bán thời gian có thể giúp sinh viên trang trải chi phí sinh hoạt. Điều này là do nhiều sinh viên cần tiền cho thức ăn, tiền thuê nhà, đi lại và học phí. Khi họ có thể tự kiếm tiền, họ có thể giảm bớt áp lực tài chính cho cha mẹ."
            },
            {
                en: "Moreover, working while studying can help students enhance their time-management ability. They need to arrange their schedule carefully, so they can balance their work with other priorities like their study, homework, and rest. Therefore, they can become more organized and responsible.",
                vn: "Hơn nữa, vừa học vừa làm có thể giúp sinh viên nâng cao khả năng quản lý thời gian của mình. Họ cần sắp xếp lịch trình một cách cẩn thận, để có thể cân bằng giữa công việc với các ưu tiên khác như việc học, bài tập về nhà và nghỉ ngơi. Do đó, họ có thể trở nên có tổ chức và trách nhiệm hơn."
            },
            {
                en: "Finally, students can gain social experience from part-time jobs. When working part-time, students can meet many people and communicate with customers. These experiences help them become more confident, communicate better in social situations, and gain some important soft-skills.",
                vn: "Cuối cùng, sinh viên có thể tích lũy kinh nghiệm xã hội từ các công việc bán thời gian. Khi làm việc bán thời gian, sinh viên có thể gặp gỡ nhiều người và giao tiếp với khách hàng. Những kinh nghiệm này giúp họ trở nên tự tin hơn, giao tiếp tốt hơn trong các tình huống xã hội và đạt được một số kỹ năng mềm quan trọng."
            },
            {
                en: "To sum up, it’s true that there are many reasons why many university students study and work at the same time.",
                vn: "Tóm lại, đúng là có nhiều lý do tại sao nhiều sinh viên đại học vừa học vừa làm."
            }
        ]
    },
    {
        id: "test18",
        title: "Topic 18 🍔",
        topic: "Nowadays, many children are becoming overweight or obese. This can be due to several factors.",
        promptEn: generatePromptCard({
            testNumber: '18',
            topicEn: 'Nowadays, many children are becoming overweight or obese. This can be due to several factors.',
            topicVn: 'Ngày nay, nhiều trẻ em đang trở nên thừa cân hoặc béo phì. Điều này có thể do một số yếu tố.',
            centerEn: 'Overweight or obese',
            centerVn: 'Thừa cân hoặc béo phì',
            idea1: { en: 'Eating unhealthy food', vn: 'Ăn thực phẩm không lành mạnh', tag: 'Danh động từ' },
            idea2: { en: 'Lack of physical activities', vn: 'Thiếu các hoạt động thể chất', tag: 'Cụm danh từ' },
            idea3: { en: 'Increased screen time', vn: 'Tăng thời gian sử dụng thiết bị điện tử', tag: 'Cụm danh từ' }
        }),
        promptVn: `<strong>Chủ đề:</strong> Ngày nay, nhiều trẻ em đang trở nên thừa cân hoặc béo phì. Điều này có thể do một số yếu tố.<br>`,
        vocab: generateIdeaExpansion([
            {
                num: '1',
                titleVn: 'Ăn thực phẩm không lành mạnh',
                coreEn: 'children eat too much unhealthy food',
                steps: [
                    {
                        role: 'Ví dụ',
                        vn: 'Trẻ nhỏ rất thích gà rán, khoai tây chiên, bánh kẹo ngọt và trà sữa',
                        en: 'kids love fast food like fried chicken, sweets, and soft drinks'
                    },
                    {
                        role: 'Giải thích',
                        vn: 'Đồ ăn nhanh rất dễ mua nhưng chứa quá nhiều đường và dầu mỡ',
                        en: 'easy to buy, but contain too much sugar and fat'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Ăn thường xuyên làm cơ thể tích mỡ và tăng cân rất nhanh',
                        en: 'eat them too often and gain weight quickly'
                    }
                ]
            },
            {
                num: '2',
                titleVn: 'Thiếu các hoạt động thể chất',
                coreEn: 'do not get enough physical exercise',
                steps: [
                    {
                        role: 'Lý do',
                        vn: 'Các em phải học cả ngày ở trường rồi tối lại đi học thêm kín lịch',
                        en: 'study all day at school and attend extra classes'
                    },
                    {
                        role: 'Chi tiết',
                        vn: 'Hầu như không có thời gian ra ngoài chạy nhảy, đá bóng hay tập thể dục',
                        en: 'rarely go outside to play sports or do exercise'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Năng lượng thừa không được tiêu hao nên rất dễ bị thừa cân',
                        en: 'do not burn calories and easily become overweight'
                    }
                ]
            },
            {
                num: '3',
                titleVn: 'Tăng thời gian sử dụng thiết bị điện tử',
                coreEn: 'spend too many hours on screens',
                steps: [
                    {
                        role: 'Ví dụ',
                        vn: 'Rảnh rỗi là các bé ngồi lì xem tivi, lướt điện thoại hoặc chơi game',
                        en: 'spend hours watching TV, using phones, or playing games'
                    },
                    {
                        role: 'Giải thích',
                        vn: 'Thói quen ngồi yên một chỗ quá lâu khiến cơ thể ngày càng lười vận động',
                        en: 'sit still for a long time and move much less'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Lâu dần dẫn đến béo phì và ảnh hưởng xấu đến sức khỏe',
                        en: 'become obese and harm their health over time'
                    }
                ]
            }
        ]),
        sample: [
            {
                en: "Today, I'd like to talk about some factors causing children’s obesity.",
                vn: "Hôm nay, tôi muốn nói về một số yếu tố gây ra béo phì ở trẻ em."
            },
            {
                en: "Firstly, many children eat unhealthy food. This is because fast food, sweets, and soft drinks are very popular and easy to buy. These foods usually contain a lot of sugar, fat, and calories. If children eat them too often, they can gain weight quickly.",
                vn: "Đầu tiên, nhiều trẻ em ăn thực phẩm không lành mạnh. Điều này là do thức ăn nhanh, đồ ngọt và nước ngọt rất phổ biến và dễ mua. Những thực phẩm này thường chứa nhiều đường, chất béo và calo. Nếu trẻ em ăn chúng quá thường xuyên, chúng có thể tăng cân nhanh chóng."
            },
            {
                en: "Moreover, another factor is a lack of physical activities. Many children do not play sports or do exercise regularly. Instead, they spend most of their time studying or staying at home. Therefore, it's very easy for them to become overweight.",
                vn: "Hơn nữa, một yếu tố khác là sự thiếu hụt các hoạt động thể chất. Nhiều trẻ em không chơi thể thao hoặc tập thể dục thường xuyên. Thay vào đó, chúng dành hầu hết thời gian để học hoặc ở nhà. Do đó, rất dễ dàng để chúng trở nên thừa cân."
            },
            {
                en: "Finally, increased screen time can also lead to obesity in children. Nowadays, children spend many hours watching TV, using smartphones, or playing computer games. This habit makes children sit still for a long time and move less. Over time, they will become fat.",
                vn: "Cuối cùng, việc tăng thời gian sử dụng thiết bị điện tử cũng có thể dẫn đến béo phì ở trẻ em. Ngày nay, trẻ em dành nhiều giờ xem TV, sử dụng điện thoại thông minh hoặc chơi trò chơi máy tính. Thói quen này làm cho trẻ em ngồi yên trong thời gian dài và ít vận động hơn. Theo thời gian, chúng sẽ trở nên béo."
            },
            {
                en: "To sum up, it’s true that many children are becoming overweight, and this can be due to several factors.",
                vn: "Tóm lại, đúng là nhiều trẻ em đang trở nên thừa cân, và điều này có thể do một số yếu tố."
            }
        ]
    },
    {
        id: "test19",
        title: "Topic 19 📉",
        topic: "Nowadays, more and more young people lose their jobs for different reasons.",
        promptEn: generatePromptCard({
            testNumber: '19',
            topicEn: 'Nowadays, more and more young people lose their jobs for different reasons.',
            topicVn: 'Ngày nay, ngày càng có nhiều người trẻ mất việc làm vì nhiều lý do khác nhau.',
            centerEn: 'Lose jobs',
            centerVn: 'Mất việc làm',
            idea1: { en: 'Health issues', vn: 'Vấn đề sức khỏe', tag: 'Cụm danh từ' },
            idea2: { en: 'Lack of necessary skills', vn: 'Thiếu kỹ năng cần thiết', tag: 'Cụm danh từ' },
            idea3: { en: 'Poor attitude and work ethic', vn: 'Thái độ và đạo đức làm việc kém', tag: 'Cụm danh từ' }
        }),
        promptVn: `<strong>Chủ đề:</strong> Ngày nay, ngày càng có nhiều người trẻ mất việc làm vì nhiều lý do khác nhau.<br>`,
        vocab: generateIdeaExpansion([
            {
                num: '1',
                titleVn: 'Vấn đề sức khỏe',
                coreEn: 'suffer from physical or mental health problems',
                steps: [
                    {
                        role: 'Lý do',
                        vn: 'Nhiều bạn trẻ hay thức khuya, ăn uống thất thường và chịu áp lực lớn',
                        en: 'often stay up late, eat poorly, and face heavy stress'
                    },
                    {
                        role: 'Chi tiết',
                        vn: 'Cơ thể mệt mỏi, hay ốm vặt hoặc rơi vào căng thẳng tinh thần',
                        en: 'feel tired, sick, or stressed out all the time'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Không đủ sức hoàn thành tốt công việc nên dễ bị cho nghỉ việc',
                        en: 'cannot work well on time and may lose their job'
                    }
                ]
            },
            {
                num: '2',
                titleVn: 'Thiếu kỹ năng cần thiết',
                coreEn: 'lack important skills for the job',
                steps: [
                    {
                        role: 'Giải thích',
                        vn: 'Mới ra trường nên nhiều bạn chỉ biết lý thuyết mà thiếu kỹ năng thực tế',
                        en: 'only know book theory and lack real work skills'
                    },
                    {
                        role: 'Ví dụ',
                        vn: 'Chưa thạo máy tính văn phòng, ngoại ngữ hoặc lúng túng khi gặp khách hàng',
                        en: 'weak at computer skills, English, or talking to customers'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Không theo kịp yêu cầu công việc của công ty',
                        en: 'cannot meet the company\'s expectations'
                    }
                ]
            },
            {
                num: '3',
                titleVn: 'Thái độ và đạo đức làm việc kém',
                coreEn: 'have a poor attitude at work',
                steps: [
                    {
                        role: 'Ví dụ',
                        vn: 'Đi làm hay trễ giờ, làm việc qua loa và ngại học hỏi cái mới',
                        en: 'often come late, work carelessly, and refuse to learn'
                    },
                    {
                        role: 'Giải thích',
                        vn: 'Ở nơi làm việc, thái độ nghiêm túc rất được cấp trên coi trọng',
                        en: 'a positive and serious attitude is very important at work'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Tạo ấn tượng xấu với sếp và đồng nghiệp nên sớm bị sa thải',
                        en: 'make a bad impression on bosses and get fired'
                    }
                ]
            }
        ]),
        sample: [
            {
                en: "Today, I'd like to talk about some reasons why young people lose their jobs.",
                vn: "Hôm nay, tôi muốn nói về một số lý do tại sao người trẻ tuổi bị mất việc làm."
            },
            {
                en: "Firstly, young people lose their jobs because of health issues. This can be physical or mental health problems. For example, if they are often tired, stressed, or sick, they cannot work effectively. As a result, they may find it difficult to complete their tasks on time.",
                vn: "Đầu tiên, người trẻ tuổi mất việc vì các vấn đề sức khỏe. Đó có thể là các vấn đề sức khỏe thể chất hoặc tinh thần. Ví dụ, nếu họ thường xuyên mệt mỏi, căng thẳng hoặc ốm đau, họ không thể làm việc hiệu quả. Kết quả là, họ có thể thấy khó khăn trong việc hoàn thành nhiệm vụ đúng hạn."
            },
            {
                en: "Moreover, another important reason is a lack of necessary skills. Some young workers do not have enough technical skills or soft skills for their jobs. For example, they probably don't know how to use some important computer programs, or they cannot communicate well with customers. As a result, they cannot meet the company’s expectations.",
                vn: "Hơn nữa, một lý do quan trọng khác là sự thiếu hụt các kỹ năng cần thiết. Một số công nhân trẻ không có đủ kỹ năng kỹ thuật hoặc kỹ năng mềm cho công việc của họ. Ví dụ, họ có thể không biết cách sử dụng một số chương trình máy tính quan trọng, hoặc họ không thể giao tiếp tốt với khách hàng. Kết quả là, họ không thể đáp ứng được những kỳ vọng của công ty."
            },
            {
                en: "Finally, poor attitude and work ethic can also make young people lose their jobs. This is because in the workplace, a positive attitude is very important. However, some people are often late, lazy, careless, or not willing to learn. This can create a bad impression on their managers and co-workers.",
                vn: "Cuối cùng, thái độ và đạo đức làm việc kém cũng có thể khiến người trẻ tuổi mất việc làm. Điều này là do ở nơi làm việc, một thái độ tích cực là rất quan trọng. Tuy nhiên, một số người thường xuyên đi trễ, lười biếng, bất cẩn hoặc không sẵn sàng học hỏi. Điều này có thể tạo ra một ấn tượng xấu đối với các quản lý và đồng nghiệp của họ."
            },
            {
                en: "To sum up, it’s true that young people may lose their jobs for different reasons.",
                vn: "Tóm lại, đúng là người trẻ tuổi có thể mất việc làm vì những lý do khác nhau."
            }
        ]
    },
    {
        id: "test20",
        title: "Topic 20 🤝",
        topic: "Good relationships at work are very important for employees and companies.",
        promptEn: generatePromptCard({
            testNumber: '20',
            topicEn: 'Good relationships at work are very important for employees and companies.',
            topicVn: 'Các mối quan hệ tốt ở nơi làm việc rất quan trọng đối với nhân viên và công ty.',
            centerEn: 'Relationships at work',
            centerVn: 'Mối quan hệ ở nơi làm việc',
            idea1: { en: 'Higher productivity', vn: 'Năng suất cao hơn', tag: 'Cụm danh từ' },
            idea2: { en: 'Higher level of job satisfaction', vn: 'Mức độ hài lòng với công việc cao hơn', tag: 'Cụm danh từ' },
            idea3: { en: 'Better collaboration', vn: 'Sự cộng tác tốt hơn', tag: 'Cụm danh từ' }
        }),
        promptVn: `<strong>Chủ đề:</strong> Các mối quan hệ tốt ở nơi làm việc rất quan trọng đối với nhân viên và công ty.<br>`,
        vocab: generateIdeaExpansion([
            {
                num: '1',
                titleVn: 'Năng suất cao hơn',
                coreEn: 'help employees have higher productivity',
                steps: [
                    {
                        role: 'Giải thích',
                        vn: 'Khi quý mến đồng nghiệp, tinh thần thoải mái nên tập trung làm việc tốt hơn',
                        en: 'feel comfortable with coworkers and focus better on tasks'
                    },
                    {
                        role: 'Chi tiết',
                        vn: 'Gặp việc khó cũng dễ nhờ cậy và sẵn lòng phụ giúp lẫn nhau',
                        en: 'willing to ask for help and support each other'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Giải quyết công việc nhanh gọn và hiệu quả hơn nhiều',
                        en: 'finish work much faster and more effectively'
                    }
                ]
            },
            {
                num: '2',
                titleVn: 'Mức độ hài lòng với công việc cao hơn',
                coreEn: 'feel happier and more satisfied with the job',
                steps: [
                    {
                        role: 'Lý do',
                        vn: 'Nhân viên dành gần cả ngày ở văn phòng nên không khí làm việc rất quan trọng',
                        en: 'spend many hours every day at the office'
                    },
                    {
                        role: 'Giải thích',
                        vn: 'Có đồng nghiệp tốt bụng, vui vẻ giúp mỗi ngày đi làm đều thấy nhẹ nhàng',
                        en: 'kind and friendly coworkers make workdays enjoyable'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Bớt căng thẳng, yêu chỗ làm hơn và muốn gắn bó lâu dài',
                        en: 'feel less stressed and stay with the company longer'
                    }
                ]
            },
            {
                num: '3',
                titleVn: 'Sự cộng tác tốt hơn',
                coreEn: 'improve teamwork and collaboration',
                steps: [
                    {
                        role: 'Giải thích',
                        vn: 'Khi đã hiểu và tin tưởng nhau thì trao đổi công việc rất cởi mở, dễ dàng',
                        en: 'trust each other and share ideas easily'
                    },
                    {
                        role: 'Chi tiết',
                        vn: 'Tránh được những hiểu lầm hay tranh cãi không đáng có khi làm chung dự án',
                        en: 'avoid misunderstandings when working in teams'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Cùng nhau tháo gỡ khó khăn và mang lại kết quả chung tốt đẹp',
                        en: 'solve problems together and achieve great results'
                    }
                ]
            }
        ]),
        sample: [
            {
                en: "Today, I'd like to talk about the benefits of good workplace relationships.",
                vn: "Hôm nay, tôi muốn nói về những lợi ích của các mối quan hệ tốt đẹp nơi làm việc."
            },
            {
                en: "Firstly, good relationships at work can help employees have higher productivity. This is because when people feel comfortable with their colleagues, they can focus better on their tasks. They are also more willing to help each other, so people can complete their tasks more quickly and effectively.",
                vn: "Đầu tiên, các mối quan hệ tốt tại nơi làm việc có thể giúp nhân viên có năng suất cao hơn. Điều này là do khi mọi người cảm thấy thoải mái với đồng nghiệp của họ, họ có thể tập trung tốt hơn vào nhiệm vụ của mình. Họ cũng sẵn sàng giúp đỡ lẫn nhau hơn, vì vậy mọi người có thể hoàn thành nhiệm vụ của họ nhanh chóng và hiệu quả hơn."
            },
            {
                en: "Moreover, good workplace relationships can lead to a higher level of job satisfaction. Employees often spend many hours at work every day, so a friendly working environment is very important. If they have kind and supportive co-workers, they can feel happier and less stressed at work.",
                vn: "Hơn nữa, các mối quan hệ tốt đẹp tại nơi làm việc có thể dẫn đến mức độ hài lòng với công việc cao hơn. Nhân viên thường dành nhiều giờ tại nơi làm việc mỗi ngày, do đó một môi trường làm việc thân thiện là rất quan trọng. Nếu họ có những đồng nghiệp tốt bụng và hay giúp đỡ, họ có thể cảm thấy hạnh phúc hơn và bớt căng thẳng hơn tại nơi làm việc."
            },
            {
                en: "Finally, good relationships can improve collaboration. In many jobs, people need to work in teams and share ideas with others. When employees trust each other, they can communicate more easily and solve problems together. As a result, the team can achieve better results.",
                vn: "Cuối cùng, các mối quan hệ tốt có thể cải thiện sự cộng tác. Trong nhiều công việc, mọi người cần làm việc theo nhóm và chia sẻ ý tưởng với người khác. Khi nhân viên tin tưởng lẫn nhau, họ có thể giao tiếp dễ dàng hơn và cùng nhau giải quyết vấn đề. Kết quả là, nhóm có thể đạt được những kết quả tốt hơn."
            },
            {
                en: "To sum up, it’s true that Good relationships at work are very important for employees and companies.",
                vn: "Tóm lại, đúng là các mối quan hệ tốt ở nơi làm việc rất quan trọng đối với nhân viên và công ty."
            }
        ]
    },
    {
        id: "test21",
        title: "Topic 21 👥",
        topic: "Teamwork is very important in a professional working environment.",
        promptEn: generatePromptCard({
            testNumber: '21',
            topicEn: 'Teamwork is very important in a professional working environment.',
            topicVn: 'Làm việc nhóm rất quan trọng trong một môi trường làm việc chuyên nghiệp.',
            centerEn: 'Teamwork',
            centerVn: 'Làm việc nhóm',
            idea1: { en: 'Shared responsibility', vn: 'Chia sẻ trách nhiệm', tag: 'Cụm danh từ' },
            idea2: { en: 'Leadership development', vn: 'Phát triển năng lực lãnh đạo', tag: 'Cụm danh từ' },
            idea3: { en: 'Diverse perspectives', vn: 'Quan điểm đa dạng', tag: 'Cụm danh từ' }
        }),
        promptVn: `<strong>Chủ đề:</strong> Làm việc nhóm rất quan trọng trong một môi trường làm việc chuyên nghiệp.<br>`,
        vocab: generateIdeaExpansion([
            {
                num: '1',
                titleVn: 'Chia sẻ trách nhiệm',
                coreEn: 'share work and responsibility together',
                steps: [
                    {
                        role: 'Lý do',
                        vn: 'Công việc ở công ty thường nhiều và lớn, một người ôm hết sẽ quá tải',
                        en: 'do not have to do everything alone'
                    },
                    {
                        role: 'Giải thích',
                        vn: 'Mỗi thành viên nhận một phần việc phù hợp với khả năng của mình',
                        en: 'each member takes care of a different task'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Công việc nhẹ nhàng hơn và hoàn thành kịp tiến độ',
                        en: 'work becomes easier and finishes much faster'
                    }
                ]
            },
            {
                num: '2',
                titleVn: 'Phát triển năng lực lãnh đạo',
                coreEn: 'help employees develop leadership skills',
                steps: [
                    {
                        role: 'Giải thích',
                        vn: 'Nhân viên có cơ hội tập dẫn dắt một nhóm nhỏ hoặc phụ trách đầu việc',
                        en: 'have chances to lead a small task or group'
                    },
                    {
                        role: 'Ví dụ',
                        vn: 'Học cách phân công việc, hướng dẫn mọi người và đưa ra quyết định',
                        en: 'learn how to give instructions and make decisions'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Rất có ích để phát triển và thăng tiến trong sự nghiệp sau này',
                        en: 'very useful for their future career'
                    }
                ]
            },
            {
                num: '3',
                titleVn: 'Quan điểm đa dạng',
                coreEn: 'bring many different ideas and viewpoints',
                steps: [
                    {
                        role: 'Giải thích',
                        vn: 'Mỗi người trong nhóm có thế mạnh, kiến thức và kinh nghiệm khác nhau',
                        en: 'each person has different strengths and experience'
                    },
                    {
                        role: 'Chi tiết',
                        vn: 'Khi cùng bàn bạc sẽ nhìn vấn đề từ nhiều góc độ và nảy ra nhiều ý hay',
                        en: 'share ideas and look at problems in many ways'
                    },
                    {
                        role: 'Kết quả',
                        vn: 'Tìm ra cách giải quyết tối ưu nhất cho công việc chung',
                        en: 'find the best solution and improve work quality'
                    }
                ]
            }
        ]),
        sample: [
            {
                en: "Today, I'd like to talk about the benefits of teamwork in a professional environment.",
                vn: "Hôm nay, tôi muốn nói về những lợi ích của việc làm việc nhóm trong một môi trường chuyên nghiệp."
            },
            {
                en: "Firstly, teamwork helps employees share responsibility. This is because when people work in a team, they do not have to do everything alone. Each member can take care of a different task. As a result, the work becomes easier and the team can complete the task more quickly.",
                vn: "Đầu tiên, làm việc nhóm giúp nhân viên chia sẻ trách nhiệm. Điều này là do khi mọi người làm việc trong một nhóm, họ không phải làm mọi thứ một mình. Mỗi thành viên có thể đảm nhận một nhiệm vụ khác nhau. Kết quả là, công việc trở nên dễ dàng hơn và nhóm có thể hoàn thành nhiệm vụ nhanh chóng hơn."
            },
            {
                en: "Moreover, teamwork can help employees develop leadership skills. In a team, each member can have opportunities to lead a small task or give instructions. Therefore, They can learn how to make decisions and solve problems. These skills are very useful for their future career.",
                vn: "Hơn nữa, làm việc nhóm có thể giúp nhân viên phát triển các kỹ năng lãnh đạo. Trong một nhóm, mỗi thành viên có thể có cơ hội dẫn dắt một nhiệm vụ nhỏ hoặc đưa ra hướng dẫn. Do đó, họ có thể học cách đưa ra quyết định và giải quyết vấn đề. Những kỹ năng này rất hữu ích cho sự nghiệp tương lai của họ."
            },
            {
                en: "Finally, teamwork brings diverse perspectives. In fact, each person has different strengths, knowledge, experience, and opinions. When team members share their ideas, they can view the problem in many different perspectives, and find the best solution. This will greatly improve work productivity.",
                vn: "Cuối cùng, làm việc nhóm mang lại những quan điểm đa dạng. Trên thực tế, mỗi người đều có những điểm mạnh, kiến thức, kinh nghiệm và ý kiến khác nhau. Khi các thành viên trong nhóm chia sẻ ý tưởng của mình, họ có thể nhìn nhận vấn đề dưới nhiều góc độ khác nhau và tìm ra giải pháp tốt nhất. Điều này sẽ cải thiện đáng kể năng suất làm việc."
            },
            {
                en: "To sum up, it’s true that teamwork is very important in a professional working environment.",
                vn: "Tóm lại, đúng là làm việc nhóm rất quan trọng trong một môi trường làm việc chuyên nghiệp."
            }
        ]
    }
];
