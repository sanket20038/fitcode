import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { 
  Dumbbell, 
  Plus, 
  Edit, 
  Trash2, 
  QrCode, 
  BarChart3, 
  LogOut,
  Building,
  Users,
  Activity,
  TrendingUp,
  Info
} from 'lucide-react';
import { gymAPI, qrAPI, analyticsAPI } from '../lib/api';
import { getUser, clearAuth } from '../lib/auth';
import GymLoader from './GymLoader';

const OwnerDashboard = ({ setAuthenticated, setUserType }) => {
  const [user] = useState(getUser());
  const [gym, setGym] = useState(null);
  const [machines, setMachines] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Form states
  const [gymForm, setGymForm] = useState({ name: '', logo_url: '', contact_info: '' });
  const [machineForm, setMachineForm] = useState({
    name: '',
    how_to_use_video_url: '',
    safety_tips: '',
    usage_guide: '',
    multilingual_content: []
  });
  // Removed local video file state as per request
  // Removed setVideoFile usage to fix ReferenceError
  const [editingMachine, setEditingMachine] = useState(null);
  const [showGymDialog, setShowGymDialog] = useState(false);
  const [showMachineDialog, setShowMachineDialog] = useState(false);

  // New state for showing the Drive upload info dialog
  const [showDriveInfoDialog, setShowDriveInfoDialog] = useState(false);

  // New state for video preview dialog
  const [showVideoPreview, setShowVideoPreview] = useState(false);

  // State to track QR generation loading for each machine
  const [qrLoadingStates, setQrLoadingStates] = useState({});

  // Helper function to extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Helper function to get embeddable Google Drive video URL
  const getDriveEmbedUrl = (url) => {
    if (!url) return null;
    // Google Drive share link format: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
    // Embed format: https://drive.google.com/file/d/FILE_ID/preview
    const regex = /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/view/;
    const match = url.match(regex);
    return match ? `https://drive.google.com/file/d/${match[1]}/preview` : null;
  };

  // Helper function to convert Google Drive image URL to direct link
  const getDriveImageUrl = (url) => {
    if (!url) return null;
    // Google Drive share link format: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
    // Direct image format: https://drive.google.com/uc?export=view&id=FILE_ID
    const regex = /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/view/;
    const match = url.match(regex);
    return match ? `https://drive.google.com/uc?export=view&id=${match[1]}` : null;
  };

  // Helper function to validate image URL
  const validateImageUrl = (url) => {
    if (!url) return false;
    // Check if it's a direct image URL
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
    if (imageExtensions.test(url)) return true;
    
    // Check if it's a Google Drive URL
    const driveRegex = /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/view/;
    if (driveRegex.test(url)) return true;
    
    // Check if it's a data URL
    if (url.startsWith('data:image/')) return true;
    
    return false;
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load gym data
      try {
        const gymResponse = await gymAPI.getGym();
        setGym(gymResponse.data.gym);
        setGymForm(gymResponse.data.gym);
      } catch (error) {
        if (error.response?.status !== 404) {
          throw error;
        }
      }

      // Load machines
      try {
        const machinesResponse = await gymAPI.getMachines();
        setMachines(machinesResponse.data.machines);
      } catch (error) {
        if (error.response?.status !== 404) {
          throw error;
        }
      }

      // Load analytics
      try {
        const analyticsResponse = await analyticsAPI.getOverview();
        setAnalytics(analyticsResponse.data.overview);
      } catch (error) {
        console.error('Failed to load analytics:', error);
      }

    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    setAuthenticated(false);
    setUserType(null);
    window.location.href = '/';
  };

  const handleGymSubmit = async (e) => {
    e.preventDefault();
    try {
      if (gym) {
        await gymAPI.updateGym(gymForm);
        setSuccess('Gym updated successfully');
      } else {
        const response = await gymAPI.createGym(gymForm);
        setGym(response.data.gym);
        setSuccess('Gym created successfully');
      }
      setShowGymDialog(false);
      loadData();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save gym');
    }
  };

   const handleMachineSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("name", machineForm.name);
    formData.append("how_to_use_video_url", machineForm.how_to_use_video_url || "");
    // Removed local_video_path and video file appending as per request
    // Append other fields  
    formData.append("safety_tips", machineForm.safety_tips || "");
    formData.append("usage_guide", machineForm.usage_guide || "");
    // Add multilingual_content if needed, but for now, we'll keep it simple

    try {
      if (editingMachine) {
        await gymAPI.updateMachine(editingMachine.id, formData); // Send formData
        setSuccess("Machine updated successfully");
        setError(""); // Clear error on success
      } else {
        await gymAPI.createMachine(formData); // Send formData
        setSuccess("Machine created successfully");
        setError(""); // Clear error on success
      }
      setShowMachineDialog(false);
      setEditingMachine(null);
      setMachineForm({
        name: "",
        how_to_use_video_url: "",
        local_video_path: null, // Reset local video URL
        safety_tips: "",
        usage_guide: "",
        multilingual_content: [],
      });
      // setVideoFile(null); // Removed to fix ReferenceError
      loadData();
    } catch (error) {
      console.error("Error updating machine:", error);
      const errorMessage = error.response?.data?.message || "Failed to save machine";
      setError(errorMessage);
      setSuccess(""); // Clear success on error
    }
  };


  const handleEditMachine = (machine) => {
    setEditingMachine(machine);
    setMachineForm(machine);
    setShowMachineDialog(true);
  };

  const handleDeleteMachine = async (machineId) => {
    if (window.confirm('Are you sure you want to delete this machine?')) {
      try {
        await gymAPI.deleteMachine(machineId);
        setSuccess('Machine deleted successfully');
        loadData();
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to delete machine');
      }
    }
  };

  const handleGenerateQR = async (machineId) => {
    try {
      // Set loading state for this specific machine
      setQrLoadingStates(prev => ({ ...prev, [machineId]: true }));
      
      // First generate the QR code
      await qrAPI.generateQR(machineId);
      setSuccess('QR code generated and downloaded successfully!');
      
      // Then automatically download it
      const response = await qrAPI.getQRImage(machineId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      const filename = `qr_code_machine_${machineId}.png`;
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      
      try {
        link.click();
        // Update success message with filename
        const machineName = machines.find(m => m.id === machineId)?.name || `Machine ${machineId}`;
        setSuccess(`QR code for "${machineName}" generated and downloaded as "${filename}"!`);
      } catch (downloadError) {
        // If automatic download fails, show a message with manual download option
        setSuccess(`QR code generated successfully! If download didn't start automatically, right-click the link and select "Save as".`);
      } finally {
        link.remove();
        window.URL.revokeObjectURL(url);
      }
      
      // Reload data to update the UI
      loadData();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to generate or download QR code');
    } finally {
      // Clear loading state
      setQrLoadingStates(prev => ({ ...prev, [machineId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <GymLoader size="xlarge" text="Loading gym dashboard..." variant="video" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Dumbbell className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">FitCode Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.username}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Drive Upload Info Dialog */}
      <Dialog open={showDriveInfoDialog} onOpenChange={setShowDriveInfoDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>How to Upload Files to Google Drive</DialogTitle>
            <DialogDescription>
              Follow these steps to upload your videos and images to Google Drive and get the shareable link.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* For Videos */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">For Videos:</h3>
              <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                <li>Open your Google Drive account.</li>
                <li>Click the "New" button and select "File upload".</li>
                <li>Choose the video file from your computer and upload it.</li>
                <li>Once uploaded, right-click the video file and select "Get link".</li>
                <li>Set the link sharing to "Anyone with the link".</li>
                <li>Copy the shareable link and paste it into the video URL field.</li>
              </ol>
            </div>
            
            {/* For Images */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">For Images (Logo):</h3>
              <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                <li>Open your Google Drive account.</li>
                <li>Click the "New" button and select "File upload".</li>
                <li>Choose your logo image file (JPG, PNG, GIF, etc.) and upload it.</li>
                <li>Once uploaded, right-click the image file and select "Get link".</li>
                <li>Set the link sharing to "Anyone with the link".</li>
                <li>Copy the shareable link and paste it into the logo URL field.</li>
                <li>The system will automatically convert it to a direct image link.</li>
              </ol>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Important Notes:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Make sure to set sharing permissions to "Anyone with the link can view"</li>
                <li>• For images, the system supports JPG, PNG, GIF, WebP, and SVG formats</li>
                <li>• For videos, the system supports MP4, AVI, MOV, and other common formats</li>
                <li>• You can also use direct image URLs from other sources</li>
              </ul>
            </div>
            
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                width="100%"
                height="360"
                src="https://www.youtube.com/embed/moVJE5h_np8?si=m_heRcsmqEcSh6kN"
                title="YouTube video tutorial"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => setShowDriveInfoDialog(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {/* Analytics Cards */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Building className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Machines</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.total_machines}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Activity className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Scans</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.total_scans}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Recent Scans</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.recent_scans}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Unique Users</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.unique_users}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="gym" className="space-y-6">
          <TabsList>
            <TabsTrigger value="gym">Gym Settings</TabsTrigger>
            <TabsTrigger value="machines">Machines</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Gym Settings Tab */}
          <TabsContent value="gym">
            <Card>
              <CardHeader>
                <CardTitle>Gym Information</CardTitle>
                <CardDescription>
                  Manage your gym's basic information and branding
                </CardDescription>
              </CardHeader>
              <CardContent>
                {gym ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">{gym.name}</h3>
                      <p className="text-gray-600">{gym.contact_info}</p>
                      {gym.logo_url && (
                        <div className="mt-2">
                          <img 
                            src={getDriveImageUrl(gym.logo_url) || gym.logo_url} 
                            alt="Gym Logo" 
                            className="h-16 w-16 object-cover rounded border border-gray-200"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'block';
                            }}
                          />
                          <div className="hidden text-sm text-gray-500 mt-1">
                            Invalid logo URL
                          </div>
                        </div>
                      )}
                    </div>
                    <Dialog open={showGymDialog} onOpenChange={setShowGymDialog}>
                      <DialogTrigger asChild>
                        <Button>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Gym Info
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Gym Information</DialogTitle>
                          <DialogDescription>
                            Update your gym's information and branding
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleGymSubmit} className="space-y-4">
                          <Input
                            placeholder="Gym Name"
                            value={gymForm.name}
                            onChange={(e) => setGymForm({ ...gymForm, name: e.target.value })}
                            required
                          />
                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-900">
                              Logo URL
                            </label>
                            <div className="flex items-center space-x-2">
                              <Input
                                placeholder="Enter logo URL (direct image link or Google Drive share link)"
                                value={gymForm.logo_url}
                                onChange={(e) => setGymForm({ ...gymForm, logo_url: e.target.value })}
                                className={`rounded-md border shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                  gymForm.logo_url && !validateImageUrl(gymForm.logo_url) 
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                    : 'border-gray-300'
                                }`}
                              />
                              <button
                                type="button"
                                aria-label="Show Drive upload info"
                                onClick={() => {
                                  setShowDriveInfoDialog(true);
                                }}
                                className="text-blue-600 hover:text-blue-800 focus:outline-none p-1 rounded-full transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-blue-500"
                                title="How to upload images to Google Drive"
                              >
                                <Info className="h-5 w-5" />
                              </button>
                            </div>
                            {gymForm.logo_url && !validateImageUrl(gymForm.logo_url) && (
                              <p className="text-sm text-red-600">
                                Please enter a valid image URL or Google Drive share link
                              </p>
                            )}
                            {gymForm.logo_url && validateImageUrl(gymForm.logo_url) && (
                              <div className="mt-2">
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Logo Preview</label>
                                <div className="w-20 h-20 rounded-lg border border-gray-300 overflow-hidden bg-gray-50 flex items-center justify-center">
                                  <img 
                                    src={getDriveImageUrl(gymForm.logo_url) || gymForm.logo_url} 
                                    alt="Logo Preview" 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.nextSibling.style.display = 'flex';
                                    }}
                                  />
                                  <div className="hidden text-gray-400 text-xs text-center p-2">
                                    Invalid image
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          <Textarea
                            placeholder="Contact Information"
                            value={gymForm.contact_info}
                            onChange={(e) => setGymForm({ ...gymForm, contact_info: e.target.value })}
                          />
                          <Button type="submit">Update Gym</Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No gym registered</h3>
                    <p className="text-gray-600 mb-4">Create your gym profile to get started</p>
                    <Dialog open={showGymDialog} onOpenChange={setShowGymDialog}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Create Gym
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Create Gym</DialogTitle>
                          <DialogDescription>
                            Set up your gym's information and branding
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleGymSubmit} className="space-y-4">
                          <Input
                            placeholder="Gym Name"
                            value={gymForm.name}
                            onChange={(e) => setGymForm({ ...gymForm, name: e.target.value })}
                            required
                          />
                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-900">
                              Logo URL
                            </label>
                            <div className="flex items-center space-x-2">
                              <Input
                                placeholder="Enter logo URL (direct image link or Google Drive share link)"
                                value={gymForm.logo_url}
                                onChange={(e) => setGymForm({ ...gymForm, logo_url: e.target.value })}
                                className={`rounded-md border shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                  gymForm.logo_url && !validateImageUrl(gymForm.logo_url) 
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                    : 'border-gray-300'
                                }`}
                              />
                              <button
                                type="button"
                                aria-label="Show Drive upload info"
                                onClick={() => {
                                  setShowDriveInfoDialog(true);
                                }}
                                className="text-blue-600 hover:text-blue-800 focus:outline-none p-1 rounded-full transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-blue-500"
                                title="How to upload images to Google Drive"
                              >
                                <Info className="h-5 w-5" />
                              </button>
                            </div>
                            {gymForm.logo_url && !validateImageUrl(gymForm.logo_url) && (
                              <p className="text-sm text-red-600">
                                Please enter a valid image URL or Google Drive share link
                              </p>
                            )}
                            {gymForm.logo_url && validateImageUrl(gymForm.logo_url) && (
                              <div className="mt-2">
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Logo Preview</label>
                                <div className="w-20 h-20 rounded-lg border border-gray-300 overflow-hidden bg-gray-50 flex items-center justify-center">
                                  <img 
                                    src={getDriveImageUrl(gymForm.logo_url) || gymForm.logo_url} 
                                    alt="Logo Preview" 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.nextSibling.style.display = 'flex';
                                    }}
                                  />
                                  <div className="hidden text-gray-400 text-xs text-center p-2">
                                    Invalid image
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          <Textarea
                            placeholder="Contact Information"
                            value={gymForm.contact_info}
                            onChange={(e) => setGymForm({ ...gymForm, contact_info: e.target.value })}
                          />
                          <Button type="submit">Create Gym</Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Machines Tab */}
          <TabsContent value="machines">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Gym Machines</CardTitle>
                    <CardDescription>
                      Manage your gym machines and generate QR codes
                    </CardDescription>
                  </div>
                  <Dialog open={showMachineDialog} onOpenChange={setShowMachineDialog}>
                    <DialogTrigger asChild>
                      <Button disabled={!gym}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Machine
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          {editingMachine ? 'Edit Machine' : 'Add New Machine'}
                        </DialogTitle>
                        <DialogDescription>
                          {editingMachine ? 'Update machine information' : 'Add a new machine to your gym'}
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleMachineSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-lg">
                        <div>
                          <label htmlFor="machineName" className="block text-sm font-semibold text-gray-900 mb-2">
                            Machine Name <span className="text-red-600">*</span>
                          </label>
                          <Input
                            id="machineName"
                            placeholder="Enter machine name"
                            value={machineForm.name}
                            onChange={(e) => setMachineForm({ ...machineForm, name: e.target.value })}
                            required
                            className="rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="videoUrl" className="block text-sm font-semibold text-gray-900 mb-2">
                            How-to-use Video URL
                          </label>
                          <div className="flex items-center space-x-2">
                            <Input
                              id="videoUrl"
                              placeholder="Enter video URL (e.g., YouTube or Google Drive)"
                              value={machineForm.how_to_use_video_url}
                              onChange={(e) => setMachineForm({ ...machineForm, how_to_use_video_url: e.target.value })}
                              className="rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button
                              type="button"
                              aria-label="Show Drive upload info"
                              onClick={() => {
                                setShowDriveInfoDialog(true);
                              }}
                              className="text-blue-600 hover:text-blue-800 focus:outline-none p-1 rounded-full transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-blue-500"
                              title="How to upload videos to Google Drive"
                            >
                              <Info className="h-6 w-6" />
                            </button>
                          </div>
                          {/* TODO: Add the permanent link for how to upload Drive videos here */}
                        </div>
                        {/* Removed local video upload input as per request */}
                        <div>
                          <label htmlFor="safetyTips" className="block text-sm font-semibold text-gray-900 mb-2">
                            Safety Tips
                          </label>
                          <Textarea
                            id="safetyTips"
                            placeholder="Enter safety tips"
                            rows={4}
                            value={machineForm.safety_tips}
                            onChange={(e) => setMachineForm({ ...machineForm, safety_tips: e.target.value })}
                            className="rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        {/* Video Preview Section */}
                        {machineForm.how_to_use_video_url && (
                          <div className="mt-4">
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Video Preview</label>
                            {getYouTubeVideoId(machineForm.how_to_use_video_url) ? (
                              <iframe
                                width="100%"
                                height="315"
                                src={`https://www.youtube.com/embed/${getYouTubeVideoId(machineForm.how_to_use_video_url)}`}
                                title="YouTube video preview"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              ></iframe>
                            ) : getDriveEmbedUrl(machineForm.how_to_use_video_url) ? (
                              <iframe
                                width="100%"
                                height="315"
                                src={getDriveEmbedUrl(machineForm.how_to_use_video_url)}
                                title="Google Drive video preview"
                                frameBorder="0"
                                allow="autoplay"
                                allowFullScreen
                              ></iframe>
                            ) : (
                              <p className="text-sm text-gray-600">Invalid video URL for preview.</p>
                            )}
                          </div>
                        )}

                        <div>
                          <label htmlFor="usageGuide" className="block text-sm font-semibold text-gray-900 mb-2">
                            Usage Guide
                          </label>
                          <Textarea
                            id="usageGuide"
                            placeholder="Enter usage guide"
                            rows={4}
                            value={machineForm.usage_guide}
                            onChange={(e) => setMachineForm({ ...machineForm, usage_guide: e.target.value })}
                            className="rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div className="flex justify-end">
                          <Button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
                          >
                            {editingMachine ? 'Update Machine' : 'Add Machine'}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {machines.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {machines.map((machine) => (
                      <Card key={machine.id}>
                        <CardContent className="p-4">
                          <h3 className="font-medium text-lg mb-2">{machine.name}</h3>
                          <div className="space-y-2 mb-4">
                            {machine.how_to_use_video_url && (
                              <Badge variant="secondary">Has Video</Badge>
                            )}
                            {machine.safety_tips && (
                              <Badge variant="secondary">Safety Tips</Badge>
                            )}
                            {machine.usage_guide && (
                              <Badge variant="secondary">Usage Guide</Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditMachine(machine)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteMachine(machine.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleGenerateQR(machine.id)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                              disabled={qrLoadingStates[machine.id]}
                            >
                              {qrLoadingStates[machine.id] ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                                  Generating & Downloading...
                                </>
                              ) : (
                                <>
                                  <QrCode className="h-4 w-4 mr-1" />
                                  Generate & Download QR
                                </>
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Dumbbell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No machines added</h3>
                    <p className="text-gray-600">Add your first machine to get started</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Overview</CardTitle>
                <CardDescription>
                  View your gym's usage statistics and insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                {analytics ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-blue-50 p-6 rounded-lg">
                        <h3 className="text-lg font-medium text-blue-900 mb-2">Total Activity</h3>
                        <p className="text-3xl font-bold text-blue-600">{analytics.total_scans}</p>
                        <p className="text-sm text-blue-700">Total QR code scans</p>
                      </div>
                      <div className="bg-green-50 p-6 rounded-lg">
                        <h3 className="text-lg font-medium text-green-900 mb-2">Recent Activity</h3>
                        <p className="text-3xl font-bold text-green-600">{analytics.recent_scans}</p>
                        <p className="text-sm text-green-700">Scans in last {analytics.date_range_days} days</p>
                      </div>
                    </div>
                    <div className="text-center py-8">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">More detailed analytics coming soon!</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No analytics data</h3>
                    <p className="text-gray-600">Analytics will appear once clients start scanning your QR codes</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OwnerDashboard;

