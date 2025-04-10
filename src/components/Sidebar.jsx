// src/components/Sidebar.jsx
import React, { useState } from 'react'
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai'
import { BsFillPeopleFill } from 'react-icons/bs'
import { FaWallet, FaHome } from 'react-icons/fa'
import { MdHelp } from 'react-icons/md'
import { Link } from 'react-router-dom'

const Sidebar = () => {
  const [nav, setNav] = useState(false)

  return (
    <div className="p-4">
      {/* <div onClick={() => setNav(!nav)} className="cursor-pointer">
        <AiOutlineMenu size={30} />
      </div> */}

      {/* <h1 className="text-2xl font-bold my-4">Menu</h1> */}

      <ul className="space-y-4">
        <li className="text-xl flex items-center">
          <FaHome size={25} className="mr-3" />
          <Link to="/" onClick={() => setNav(false)}>
            Página inicial
          </Link>
        </li>
        <li className="text-xl flex items-center">
          <BsFillPeopleFill size={25} className="mr-3" />
          <Link to="/cadastros" onClick={() => setNav(false)}>
            Cadastros
          </Link>
        </li>
        <li className="text-xl flex items-center">
          <FaWallet size={25} className="mr-3" />
          <span>Carteira</span>
        </li>
        <li className="text-xl flex items-center">
          <MdHelp size={25} className="mr-3" />
          <span>Ajuda</span>
        </li>
      </ul>
    </div>
  )
}

export default Sidebar
