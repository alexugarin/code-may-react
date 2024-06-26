import React, { useState, useEffect } from 'react';
import { performFetchA } from '../../service/api';

const GetRolesComponent: React.FC<{ onSelectRole: (role: string) => void }> = ({ onSelectRole }) => {
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      try {
        const data = await performFetchA({
          endpoint: 'api/get-roles',
          method: 'GET',
        });
        console.log(data)
        setRoles(data.roles);
        setLoading(false) 
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    };

    fetchRoles();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <select onChange={(e) => onSelectRole(e.target.value)}>
          {roles.map((role, index) => (
            <option key={index} value={role}>
              {role}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default GetRolesComponent;