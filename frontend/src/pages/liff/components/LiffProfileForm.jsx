const PROVINCES = [
  "กรุงเทพมหานคร", "กระบี่", "กาญจนบุรี", "กาฬสินธุ์", "กำแพงเพชร", "ขอนแก่น", "จันทบุรี",
  "ฉะเชิงเทรา", "ชลบุรี", "ชัยนาท", "ชัยภูมิ", "ชุมพร", "เชียงราย", "เชียงใหม่", "ตรัง",
  "ตราด", "ตาก", "นครนายก", "นครปฐม", "นครพนม", "นครราชสีมา", "นครศรีธรรมราช",
  "นครสวรรค์", "นนทบุรี", "นราธิวาส", "น่าน", "บึงกาฬ", "บุรีรัมย์", "ปทุมธานี",
  "ประจวบคีรีขันธ์", "ปราจีนบุรี", "ปัตตานี", "พระนครศรีอยุธยา", "พังงา", "พัทลุง",
  "พิจิตร", "พิษณุโลก", "เพชรบุรี", "เพชรบูรณ์", "แพร่", "พะเยา", "ภูเก็ต", "มหาสารคาม",
  "มุกดาหาร", "แม่ฮ่องสอน", "ยโสธร", "ยะลา", "ร้อยเอ็ด", "ระนอง", "ระยอง", "ราชบุรี",
  "ลพบุรี", "ลำปาง", "ลำพูน", "เลย", "ศรีสะเกษ", "สกลนคร", "สงขลา", "สตูล", "สมุทรปราการ",
  "สมุทรสงคราม", "สมุทรสาคร", "สระแก้ว", "สระบุรี", "สิงห์บุรี", "สุโขทัย", "สุพรรณบุรี",
  "สุราษฎร์ธานี", "สุรินทร์", "หนองคาย", "หนองบัวลำภู", "อ่างทอง", "อุดรธานี", "อุทัยธานี",
  "อุตรดิตถ์", "อุบลราชธานี", "อำนาจเจริญ",
]

function LiffProfileForm({ formData, saving, submitError, onChange, onSubmit, onBack }) {
  return (
    <div className="rounded-2xl border border-[rgba(212,175,55,0.3)] bg-[rgba(45,27,78,0.6)] p-6 shadow-2xl shadow-[#8b5cf6]/20 backdrop-blur-xl md:p-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-[#f5f5dc]">ข้อมูลวันเกิด</h2>
          <p className="mt-2 text-sm leading-6 text-[#ddd6fe]">
            กรอกข้อมูลให้ครบเพื่อใช้ในการทำนายดวงชะตา
          </p>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="shrink-0 rounded-lg border border-[rgba(212,175,55,0.25)] px-3 py-2 text-sm text-[#d4af37] transition hover:bg-[rgba(212,175,55,0.08)]"
        >
          กลับ
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label htmlFor="full_name" className="mb-2 block text-sm font-medium text-[#d4af37]">
            ชื่อ-นามสกุล
          </label>
          <input
            id="full_name"
            type="text"
            required
            value={formData.full_name}
            onChange={(event) => onChange("full_name", event.target.value)}
            placeholder="กรอกชื่อของคุณ"
            className="w-full rounded-xl border border-[rgba(212,175,55,0.3)] bg-[rgba(45,27,78,0.5)] px-4 py-3 text-[#f5f5dc] placeholder:text-[#c4b5fd]/50 focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="birth_date" className="mb-2 block text-sm font-medium text-[#d4af37]">
              วันเกิด
            </label>
            <input
              id="birth_date"
              type="date"
              required
              value={formData.birth_date}
              onChange={(event) => onChange("birth_date", event.target.value)}
              className="w-full rounded-xl border border-[rgba(212,175,55,0.3)] bg-[rgba(45,27,78,0.5)] px-4 py-3 text-[#f5f5dc] focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
            />
          </div>

          <div>
            <label htmlFor="birth_time" className="mb-2 block text-sm font-medium text-[#d4af37]">
              เวลาเกิด
            </label>
            <input
              id="birth_time"
              type="time"
              required
              value={formData.birth_time}
              onChange={(event) => onChange("birth_time", event.target.value)}
              className="w-full rounded-xl border border-[rgba(212,175,55,0.3)] bg-[rgba(45,27,78,0.5)] px-4 py-3 text-[#f5f5dc] focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
            />
          </div>
        </div>

        <div>
          <label htmlFor="birth_place" className="mb-2 block text-sm font-medium text-[#d4af37]">
            จังหวัดเกิด
          </label>
          <select
            id="birth_place"
            required
            value={formData.birth_place}
            onChange={(event) => onChange("birth_place", event.target.value)}
            className="w-full rounded-xl border border-[rgba(212,175,55,0.3)] bg-[rgba(45,27,78,0.5)] px-4 py-3 text-[#f5f5dc] focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
          >
            <option value="" className="bg-[#2d1b4e]">
              เลือกจังหวัด
            </option>
            {PROVINCES.map((province) => (
              <option key={province} value={province} className="bg-[#2d1b4e]">
                {province}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="mb-3 block text-sm font-medium text-[#d4af37]">เพศ</div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="flex cursor-pointer items-center rounded-xl border border-[rgba(212,175,55,0.25)] bg-[rgba(45,27,78,0.4)] px-4 py-4">
              <input
                type="radio"
                name="gender"
                value="ชาย"
                checked={formData.gender === "ชาย"}
                onChange={(event) => onChange("gender", event.target.value)}
                className="h-5 w-5 accent-[#d4af37]"
                required
              />
              <span className="ml-3 text-[#f5f5dc]">ชาย</span>
            </label>

            <label className="flex cursor-pointer items-center rounded-xl border border-[rgba(212,175,55,0.25)] bg-[rgba(45,27,78,0.4)] px-4 py-4">
              <input
                type="radio"
                name="gender"
                value="หญิง"
                checked={formData.gender === "หญิง"}
                onChange={(event) => onChange("gender", event.target.value)}
                className="h-5 w-5 accent-[#d4af37]"
                required
              />
              <span className="ml-3 text-[#f5f5dc]">หญิง</span>
            </label>

             <label className="flex cursor-pointer items-center rounded-xl border border-[rgba(212,175,55,0.25)] bg-[rgba(45,27,78,0.4)] px-4 py-4">
              <input
                type="radio"
                name="gender"
                value="ไม่ระบุ"
                checked={formData.gender === "ไม่ระบุ"}
                onChange={(event) => onChange("gender", event.target.value)}
                className="h-5 w-5 accent-[#d4af37]"
                required
              />
              <span className="ml-3 text-[#f5f5dc]">ไม่ระบุ</span>
            </label>
          </div>
        </div>

        {submitError ? (
          <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {submitError}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-xl bg-gradient-to-r from-[#d4af37] to-[#fbbf24] px-4 py-4 text-base font-semibold text-[#1a0b2e] transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:shadow-[#d4af37]/40 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {saving ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
        </button>
      </form>

      <div className="mt-8 border-t border-[rgba(212,175,55,0.2)] pt-5 text-center text-sm text-[#ddd6fe]">
        ข้อมูลของคุณจะถูกใช้เพื่อคำนวณดวงชะตาเท่านั้น
      </div>
    </div>
  )
}

export default LiffProfileForm
