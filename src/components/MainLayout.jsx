// src/components/MainLayout.jsx
import PropTypes from 'prop-types'
import Sidebar from './Sidebar'

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar fixa */}
      <div className="w-64 bg-white shadow-md">
        <Sidebar />
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 p-6">{children}</div>
    </div>
  )
}

MainLayout.propTypes = {
  children: PropTypes.node.isRequired
}

export default MainLayout
