import { Language } from '../types';
import { translations } from '../data/translations';

interface TeamSectionProps {
  lang: Language;
}

export function TeamSection({ lang }: TeamSectionProps) {
  const t = translations[lang];

  return (
    <section id="team">
      <div className="wrap">
        <div className="mod-head reveal">
          <span className="mod-id">SYS.04</span>
          <h2 className="mod-title">{t.tm_title}</h2>
          <p className="mod-sub">{t.tm_sub}</p>
        </div>

        <div className="crew">
          {/* Member 1: Thanh Cong */}
          <div className="member brk reveal">
            <div className="m-top">
              <span className="m-init">TC</span>
              <span className="m-tag">ENG.SYS</span>
            </div>
            <div className="m-name">Thanh Nguyen Cong</div>
            <div className="m-role">{t.r_cong}</div>
            <p className="m-bio">{t.b_cong}</p>
            <div className="m-foot">
              <span><b>6+</b> {t.yrs}</span>
              <span>Kernel · eBPF · WAF</span>
            </div>
          </div>

          {/* Member 2: Duc Tran */}
          <div className="member brk reveal rd1">
            <div className="m-top">
              <span className="m-init">DT</span>
              <span className="m-tag">ENG.AI</span>
            </div>
            <div className="m-name">Duc Tran</div>
            <div className="m-role">{t.r_duc}</div>
            <p className="m-bio">{t.b_duc}</p>
            <div className="m-foot">
              <span><b>10+</b> {t.yrs}</span>
              <span>AI · Cloud · K8s</span>
            </div>
          </div>

          {/* Member 3: Khoi Bach */}
          <div className="member brk reveal rd2">
            <div className="m-top">
              <span className="m-init">KB</span>
              <span className="m-tag">ENG.PLAT</span>
            </div>
            <div className="m-name">Khoi Minh Bach</div>
            <div className="m-role">{t.r_khoi}</div>
            <p className="m-bio">{t.b_khoi}</p>
            <div className="m-foot">
              <span><b>3+</b> {t.yrs}</span>
              <span>LangGraph · Security</span>
            </div>
          </div>

          {/* Member 4: Tien Le */}
          <div className="member brk reveal rd2">
            <div className="m-top">
              <span className="m-init">TL</span>
              <span className="m-tag">ENG.WEB</span>
            </div>
            <div className="m-name">Tien Le</div>
            <div className="m-role">{t.r_tien}</div>
            <p className="m-bio">{t.b_tien}</p>
            <div className="m-foot">
              <span><b>8+</b> {t.yrs}</span>
              <span>Full-Stack · Data · Redis</span>
            </div>
          </div>

          {/* Member 5: Dung Tran */}
          <div className="member exec brk reveal rd3">
            <div className="m-top">
              <span className="m-init">DT</span>
              <span className="m-tag">EXEC.OPS</span>
            </div>
            <div className="m-name">Dung Tran</div>
            <div className="m-role">{t.r_dung}</div>
            <p className="m-bio">{t.b_dung}</p>
            <div className="m-foot">
              <span><b>15+</b> {t.yrs}</span>
              <span>{t.dung_exp}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
