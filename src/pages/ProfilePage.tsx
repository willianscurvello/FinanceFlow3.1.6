import React, { useState, useEffect } from 'react';
    import { useAuth } from '../contexts/AuthContext';
    import { User, Mail, Phone, Building2, Camera } from 'lucide-react';
    import { supabase } from '../lib/supabase'; // Importar o cliente Supabase

    interface ProfileForm {
      fullName: string;
      phone: string;
      company: string;
      position: string;
      avatarUrl: string; // Adicionar campo para URL da imagem
    }

    export function ProfilePage() {
      const { user } = useAuth();
      const [isEditing, setIsEditing] = useState(false);
      const [profileForm, setProfileForm] = useState<ProfileForm>({
        fullName: '',
        phone: '',
        company: '',
        position: '',
        avatarUrl: '', // Inicializar com string vazia
      });
      const [uploadStatus, setUploadStatus] = useState<string>(''); // Estado para armazenar o status do upload

      useEffect(() => {
        fetchUserProfile();
      }, [user]);

      const fetchUserProfile = async () => {
        if (user) {
          const { data, error } = await supabase
            .from('users')
            .select('name, phone, company, position, avatarUrl') // Adicionar avatarUrl
            .eq('id', user.id)
            .single();

          if (error) {
            console.error('Error fetching user profile:', error);
          } else {
            setProfileForm({
              fullName: data.name,
              phone: data.phone,
              company: data.company,
              position: data.position,
              avatarUrl: data.avatarUrl || '', // Preencher com a URL da imagem
            });
          }
        }
      };

      const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Atualizar o perfil do usuário
        const { error } = await supabase
          .from('users')
          .update({
            name: profileForm.fullName,
            phone: profileForm.phone,
            company: profileForm.company,
            position: profileForm.position,
          })
          .eq('id', user?.id);

        if (error) {
          console.error('Error updating profile:', error);
        } else {
          setIsEditing(false);
        }
      };

      const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        console.log("Arquivo selecionado:", file); // Log do arquivo selecionado

        if (!file) {
          console.error("Nenhum arquivo selecionado!");
          setUploadStatus("Nenhum arquivo selecionado!");
          return;
        }

        if (!user?.id) {
          console.error("🔴 Erro: Usuário não autenticado ou ID inválido.");
          setUploadStatus("Usuário não autenticado ou ID inválido.");
          return;
        }

        const filePath = `${user.id}/${file.name}`;
        setUploadStatus(`Fazendo upload de ${file.name}...`);

        const { data, error } = await supabase.storage
          .from('avatars') // Nome do bucket
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true, // Permitir sobrescrever arquivos existentes
          });

        if (error) {
          console.error("🔴 Erro ao enviar a imagem:", error);
          setUploadStatus(`Erro ao enviar a imagem: ${error.message}`);
          return;
        }

        console.log("Upload bem-sucedido, obtendo URL pública...");
        setUploadStatus("Upload bem-sucedido! Obtendo URL pública...");

        // Obter a URL pública da imagem
        const { data: publicData } = await supabase
          .storage
          .from('avatars')
          .getPublicUrl(filePath);

        console.log("URL pública obtida:", publicData.publicUrl); // Log da URL pública

        // Atualizar o estado do perfil com a nova imagem
        setProfileForm(prev => ({ ...prev, avatarUrl: publicData.publicUrl }));

        // Atualizar a URL no banco de dados
        const { error: updateError } = await supabase
          .from('users')
          .update({ avatarUrl: publicData.publicUrl })
          .eq('id', user.id);

        if (updateError) {
          console.error("🔴 Erro ao atualizar o avatar no banco:", updateError);
          setUploadStatus(`Erro ao atualizar o avatar no banco: ${updateError.message}`);
        } else {
          console.log("✅ Avatar atualizado com sucesso no banco!");
          setUploadStatus("Avatar atualizado com sucesso!");
        }
      };

      return (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>

          {/* Profile Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-5">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                      <img
                        src={profileForm.avatarUrl || `https://ui-avatars.com/api/?name=${profileForm.fullName}&size=96&background=0D8ABC&color=fff`}
                        alt="Profile"
                        className="h-24 w-24 object-cover"
                      />
                    </div>
                    <label className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary-600 text-white hover:bg-primary-700 cursor-pointer">
                      <Camera className="h-4 w-4" />
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {profileForm.fullName}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {profileForm.position} at {profileForm.company}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleProfileSubmit} className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Full Name
                      </label>
                      <div className="mt-1 relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          id="fullName"
                          value={profileForm.fullName}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, fullName: e.target.value }))}
                          className="pl-10 block w-full border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Phone Number
                      </label>
                      <div className="mt-1 relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="tel"
                          id="phone"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                          className="pl-10 block w-full border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Company
                      </label>
                      <div className="mt-1 relative">
                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          id="company"
                          value={profileForm.company}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, company: e.target.value }))}
                          className="pl-10 block w-full border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="position" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Position
                      </label>
                      <div className="mt-1 relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          id="position"
                          value={profileForm.position}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, position: e.target.value }))}
                          className="pl-10 block w-full border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</dt>
                      <dd className="mt-1 flex items-center text-sm text-gray-900 dark:text-white">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        {user?.email}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</dt>
                      <dd className="mt-1 flex items-center text-sm text-gray-900 dark:text-white">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        {profileForm.phone}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Company</dt>
                      <dd className="mt-1 flex items-center text-sm text-gray-900 dark:text-white">
                        <Building2 className="h-4 w-4 text-gray-400 mr-2" />
                        {profileForm.company}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Position</dt>
                      <dd className="mt-1 flex items-center text-sm text-gray-900 dark:text-white">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        {profileForm.position}
                      </dd>
                    </div>
                  </dl>
                </div>
              )}
            </div>
          </div>
          {uploadStatus && (
            <div className="mt-4 text-center text-gray-600 dark:text-gray-400">
              {uploadStatus}
            </div>
          )}
        </div>
      );
    }
