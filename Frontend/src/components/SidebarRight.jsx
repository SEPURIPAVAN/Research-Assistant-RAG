export default function SidebarRight(){
    return(
       <div className="p-4">
      <h2 className="text-lg mb-4 font-semibold text-white">Documents</h2>

      <div className="border-2 border-dashed border-[#4C82FB] p-6 rounded-xl text-center cursor-pointer hover:bg-[#1c1c1c] transition">
        Drag & drop or click to upload PDF/TXT
      </div>

       <ul className="mt-4 space-y-2">
        <li className="p-3 rounded-lg bg-[#1c1c1c] hover:bg-[#2a2a2a] cursor-pointer flex justify-between">
          <span>Quantum_Error_Correction.pdf</span>
          <span className="text-xs text-gray-500">2 MB</span>
        </li>
        <li className="p-3 rounded-lg bg-[#1c1c1c] hover:bg-[#2a2a2a] cursor-pointer flex justify-between">
          <span>AI_Methodology_Review.txt</span>
          <span className="text-xs text-gray-500">1 MB</span>
        </li>
      </ul>
    </div>
    )
}