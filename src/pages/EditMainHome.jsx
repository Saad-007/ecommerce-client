import React, { useState, useEffect } from "react";
import { createHeroSlide, getHeroSlides, updateHeroSlide, deleteHeroSlide } from "../api/hero";
import { 
  FiUpload, 
  FiTrash2, 
  FiEdit2, 
  FiArrowUp, 
  FiArrowDown, 
  FiPlus, 
  FiX, 
  FiEye, 
  FiEyeOff,
  FiSave
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { ChromePicker } from "react-color";
import { useAuth } from "../context/AuthContext";

const AdminHeroEditor = () => {
  const [slides, setSlides] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [tempSlide, setTempSlide] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showAddSlide, setShowAddSlide] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showOverlayColorPicker, setShowOverlayColorPicker] = useState(false);
    const [loading, setLoading] = useState(true); // Add this line

  const [newSlide, setNewSlide] = useState({
    id: Date.now(),
    image: null,
    title: "",
    subtitle: "",
    ctaText: "Shop Now",
    ctaLink: "/shop",
    textPosition: "center",
    textColor: "#ffffff",
    overlayColor: "#000000",
    overlayOpacity: 30,
    isActive: true,
    animationType: "fade",
    buttonStyle: "rounded-lg"
  });
  const { isAdmin } = useAuth();

   useEffect(() => {
    const fetchSlides = async () => {
      try {
        setLoading(true);
        const data = await getHeroSlides();
        setSlides(data);
      } catch (error) {
        console.error("Error fetching slides:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file?.type.startsWith("image/")) return;

    try {
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return 100;
          }
          return prev + 5;
        });
      }, 50);

      const base64 = await readFileAsDataURL(file);
      clearInterval(interval);
      setUploadProgress(100);
      
      if (isEditing !== null) {
        setTempSlide(prev => ({ ...prev, image: base64 }));
      } else {
        setNewSlide(prev => ({ ...prev, image: base64 }));
      }
      
      setTimeout(() => setUploadProgress(0), 500);
    } catch (error) {
      console.error("Error processing file:", error);
      setUploadProgress(0);
    }
  };

  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

   // Updated handleSaveSlide to use API
  const handleSaveSlide = async () => {
    if (!tempSlide.image) return;
    
    try {
      let updatedSlide;
      if (isEditing !== null) {
        updatedSlide = await updateHeroSlide(tempSlide);
        setSlides(prev => prev.map((slide, i) => 
          i === isEditing ? updatedSlide : slide
        ));
      } else {
        updatedSlide = await createHeroSlide(tempSlide);
        setSlides(prev => [...prev, updatedSlide]);
      }
    } catch (error) {
      console.error("Error saving slide:", error);
    } finally {
      setIsEditing(null);
      setTempSlide(null);
    }
  };
 const handleAddSlide = async () => {
  if (!newSlide.image) return;
  
  try {
    // Send to backend
    const createdSlide = await createHeroSlide(newSlide);
    
    // Update local state
    setSlides(prev => [...prev, createdSlide]);
    
    // Reset form
    setNewSlide({
      image: null,
      title: "",
      subtitle: "",
      ctaText: "Shop Now",
      ctaLink: "/shop",
      textPosition: "center",
      textColor: "#ffffff",
      overlayColor: "#000000",
      overlayOpacity: 30,
      isActive: true,
      animationType: "fade",
      buttonStyle: "rounded-lg"
    });
    setShowAddSlide(false);
  } catch (error) {
    console.error("Error adding slide:", error);
  }
};

 // Updated handleDelete to use API
  const handleDelete = async (index) => {
    try {
      const slideId = slides[index]._id;
      await deleteHeroSlide(slideId);
      setSlides(prev => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error deleting slide:", error);
    }
  };

  const handleEdit = (index) => {
    setIsEditing(index);
    setTempSlide({ ...slides[index] });
  };

    // Updated moveSlide to maintain order in backend
  const moveSlide = async (index, direction) => {
    if (
      (direction === -1 && index === 0) ||
      (direction === 1 && index === slides.length - 1)
    ) return;

    try {
      const newIndex = index + direction;
      const newSlides = [...slides];
      [newSlides[index], newSlides[newIndex]] = [newSlides[newIndex], newSlides[index]];
      
      // Update order in backend
      await Promise.all(
        newSlides.map((slide, i) => 
          updateHeroSlide({ ...slide, order: i })
        )
      );
      
      setSlides(newSlides);
    } catch (error) {
      console.error("Error reordering slides:", error);
    }
  };
  // Updated toggleSlideStatus to use API
  const toggleSlideStatus = async (index) => {
    try {
      const updatedSlide = { 
        ...slides[index], 
        isActive: !slides[index].isActive 
      };
      const result = await updateHeroSlide(updatedSlide);
      
      setSlides(prev => prev.map((slide, i) => 
        i === index ? result : slide
      ));
    } catch (error) {
      console.error("Error updating slide status:", error);
    }
  };



  const textPositionOptions = [
    { value: "left", label: "Left" },
    { value: "center", label: "Center" },
    { value: "right", label: "Right" }
  ];

  const animationOptions = [
    { value: "fade", label: "Fade" },
    { value: "slide", label: "Slide" },
    { value: "zoom", label: "Zoom" }
  ];

  const buttonStyleOptions = [
    { value: "rounded-lg", label: "Rounded" },
    { value: "rounded-full", label: "Pill" },
    { value: "rounded-none", label: "Square" }
  ];

  const handleColorChange = (color, field) => {
    if (isEditing !== null) {
      setTempSlide(prev => ({ ...prev, [field]: color.hex }));
    } else {
      setNewSlide(prev => ({ ...prev, [field]: color.hex }));
    }
  };

  const toggleColorPicker = () => {
    setShowColorPicker(!showColorPicker);
  };

  const toggleOverlayColorPicker = () => {
    setShowOverlayColorPicker(!showOverlayColorPicker);
  };

  const renderEditModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Edit Slide</h3>
            <button 
              onClick={() => setIsEditing(null)} 
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FiX size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Slide Image</label>
                <div className="relative">
                  <label className="flex flex-col items-center justify-center w-full h-80 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors overflow-hidden">
                    {tempSlide.image ? (
                      <img 
                        src={tempSlide.image} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-8 text-center">
                        <FiUpload className="w-12 h-12 text-gray-400 mb-4" />
                        <p className="text-sm text-gray-500 mb-1">Drag & drop or click to upload</p>
                        <p className="text-xs text-gray-400">Recommended: 1920×800 px (16:7 ratio)</p>
                      </div>
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      className="hidden" 
                    />
                  </label>
                  {uploadProgress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gray-200 rounded-b-lg h-1.5">
                      <div 
                        className="bg-blue-600 h-full rounded-b-lg transition-all duration-300" 
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Animation</label>
                  <select
                    value={tempSlide.animationType}
                    onChange={(e) => setTempSlide({...tempSlide, animationType: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {animationOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Button Style</label>
                  <select
                    value={tempSlide.buttonStyle}
                    onChange={(e) => setTempSlide({...tempSlide, buttonStyle: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {buttonStyleOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={tempSlide.title}
                  onChange={(e) => setTempSlide({...tempSlide, title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Main headline text"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={tempSlide.subtitle}
                  onChange={(e) => setTempSlide({...tempSlide, subtitle: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                  placeholder="Supporting text or promotional message"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                  <input
                    type="text"
                    value={tempSlide.ctaText}
                    onChange={(e) => setTempSlide({...tempSlide, ctaText: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. Shop Now"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Button Link</label>
                  <input
                    type="text"
                    value={tempSlide.ctaLink}
                    onChange={(e) => setTempSlide({...tempSlide, ctaLink: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="/collection"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Text Position</label>
                  <select
                    value={tempSlide.textPosition}
                    onChange={(e) => setTempSlide({...tempSlide, textPosition: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {textPositionOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
                  <div className="relative">
                    <div 
                      className="flex items-center justify-between w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer"
                      onClick={toggleColorPicker}
                    >
                      <span className="flex items-center">
                        <span 
                          className="w-5 h-5 rounded-full mr-2 border border-gray-300"
                          style={{ backgroundColor: tempSlide.textColor }}
                        />
                        {tempSlide.textColor}
                      </span>
                      {showColorPicker ? <FiEyeOff /> : <FiEye />}
                    </div>
                    {showColorPicker && (
                      <div className="absolute z-10 mt-1">
                        <ChromePicker
                          color={tempSlide.textColor}
                          onChangeComplete={(color) => handleColorChange(color, 'textColor')}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Overlay Color
                  </label>
                  <div className="relative">
                    <div 
                      className="flex items-center justify-between w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer"
                      onClick={toggleOverlayColorPicker}
                    >
                      <span className="flex items-center">
                        <span 
                          className="w-5 h-5 rounded-full mr-2 border border-gray-300"
                          style={{ backgroundColor: tempSlide.overlayColor }}
                        />
                        {tempSlide.overlayColor}
                      </span>
                      {showOverlayColorPicker ? <FiEyeOff /> : <FiEye />}
                    </div>
                    {showOverlayColorPicker && (
                      <div className="absolute z-10 mt-1">
                        <ChromePicker
                          color={tempSlide.overlayColor}
                          onChangeComplete={(color) => handleColorChange(color, 'overlayColor')}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Overlay Opacity: {tempSlide.overlayOpacity}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="70"
                    value={tempSlide.overlayOpacity}
                    onChange={(e) => setTempSlide({...tempSlide, overlayOpacity: parseInt(e.target.value)})}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex items-center pt-2">
                <input
                  type="checkbox"
                  id="activeSlide"
                  checked={tempSlide.isActive}
                  onChange={(e) => setTempSlide({...tempSlide, isActive: e.target.checked})}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="activeSlide" className="ml-3 text-sm font-medium text-gray-700">
                  Active Slide
                </label>
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <button
                  onClick={() => setIsEditing(null)}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSlide}
                  disabled={!tempSlide.image}
                  className={`px-6 py-2.5 rounded-lg font-medium ${tempSlide.image ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'} transition-colors`}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!isAdmin) {
    return (
      <div className="max-w-7xl mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
        <p className="text-gray-600">You must be an administrator to access this page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b">
          <h1 className="text-3xl font-bold text-gray-800">Hero Slider Manager</h1>
          <p className="text-gray-600 mt-2">
            Manage your store's hero carousel slides. Drag to reorder or customize each slide.
          </p>
        </div>

        <div className="p-6">
          <button
            onClick={() => setShowAddSlide(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FiPlus /> Add New Slide
          </button>

          {showAddSlide && (
            <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Add New Slide</h3>
                <button onClick={() => setShowAddSlide(false)} className="text-gray-500 hover:text-gray-700">
                  <FiX size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slide Image</label>
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    {newSlide.image ? (
                      <img src={newSlide.image} alt="Preview" className="w-full h-full object-contain p-2" />
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FiUpload className="w-10 h-10 text-gray-400 mb-3" />
                        <p className="mb-2 text-sm text-gray-500">Click to upload</p>
                        <p className="text-xs text-gray-500">Recommended: 1920×800 px</p>
                      </div>
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      className="hidden" 
                    />
                  </label>
                  {uploadProgress > 0 && (
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={newSlide.title}
                      onChange={(e) => setNewSlide({...newSlide, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Summer Collection"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={newSlide.subtitle}
                      onChange={(e) => setNewSlide({...newSlide, subtitle: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                      placeholder="Product description or promotional text"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                      <input
                        type="text"
                        value={newSlide.ctaText}
                        onChange={(e) => setNewSlide({...newSlide, ctaText: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Shop Now"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
                      <input
                        type="text"
                        value={newSlide.ctaLink}
                        onChange={(e) => setNewSlide({...newSlide, ctaLink: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="/summer-collection"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Text Position</label>
                      <select
                        value={newSlide.textPosition}
                        onChange={(e) => setNewSlide({...newSlide, textPosition: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {textPositionOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
                      <div className="relative">
                        <div 
                          className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-md cursor-pointer"
                          onClick={toggleColorPicker}
                        >
                          <span className="flex items-center">
                            <span 
                              className="w-5 h-5 rounded-full mr-2 border border-gray-300"
                              style={{ backgroundColor: newSlide.textColor }}
                            />
                            {newSlide.textColor}
                          </span>
                          {showColorPicker ? <FiEyeOff /> : <FiEye />}
                        </div>
                        {showColorPicker && (
                          <div className="absolute z-10 mt-1">
                            <ChromePicker
                              color={newSlide.textColor}
                              onChangeComplete={(color) => handleColorChange(color, 'textColor')}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Overlay Color
                      </label>
                      <div className="relative">
                        <div 
                          className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-md cursor-pointer"
                          onClick={toggleOverlayColorPicker}
                        >
                          <span className="flex items-center">
                            <span 
                              className="w-5 h-5 rounded-full mr-2 border border-gray-300"
                              style={{ backgroundColor: newSlide.overlayColor }}
                            />
                            {newSlide.overlayColor}
                          </span>
                          {showOverlayColorPicker ? <FiEyeOff /> : <FiEye />}
                        </div>
                        {showOverlayColorPicker && (
                          <div className="absolute z-10 mt-1">
                            <ChromePicker
                              color={newSlide.overlayColor}
                              onChangeComplete={(color) => handleColorChange(color, 'overlayColor')}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Overlay Opacity: {newSlide.overlayOpacity}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="70"
                        value={newSlide.overlayOpacity}
                        onChange={(e) => setNewSlide({...newSlide, overlayOpacity: parseInt(e.target.value)})}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Animation</label>
                      <select
                        value={newSlide.animationType}
                        onChange={(e) => setNewSlide({...newSlide, animationType: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {animationOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Button Style</label>
                      <select
                        value={newSlide.buttonStyle}
                        onChange={(e) => setNewSlide({...newSlide, buttonStyle: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {buttonStyleOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleAddSlide}
                    disabled={!newSlide.image}
                    className={`w-full py-3 px-4 rounded-md font-medium ${newSlide.image ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'} transition-colors`}
                  >
                    Add Slide
                  </button>
                </div>
              </div>
            </div>
          )}

          {isEditing !== null && renderEditModal()}

          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Current Slides ({slides.length})</h3>
            
            <AnimatePresence>
              {slides.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg"
                >
                  <img 
                    src="https://cdn-icons-png.flaticon.com/512/4076/4076478.png" 
                    alt="No slides" 
                    className="w-24 h-24 mb-4 opacity-50"
                  />
                  <p className="text-gray-500">No slides created yet</p>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {slides.map((slide, index) => (
                    <motion.div
                      key={slide.id || index}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className={`relative group bg-white rounded-lg shadow-sm overflow-hidden border ${
                        !slide.isActive ? 'opacity-60' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex">
                        <div className="w-1/3 h-48 bg-gray-100 relative">
                          <img 
                            src={slide.image} 
                            alt={`Slide ${index + 1}`} 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2 flex flex-col space-y-1">
                            <button
                              onClick={() => moveSlide(index, -1)}
                              disabled={index === 0}
                              className={`p-1 rounded-full ${index === 0 ? 'bg-gray-300 text-gray-500' : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'}`}
                              aria-label="Move up"
                            >
                              <FiArrowUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => moveSlide(index, 1)}
                              disabled={index === slides.length - 1}
                              className={`p-1 rounded-full ${index === slides.length - 1 ? 'bg-gray-300 text-gray-500' : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'}`}
                              aria-label="Move down"
                            >
                              <FiArrowDown className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="w-2/3 p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">{slide.title || `Slide ${index + 1}`}</h4>
                              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                {slide.subtitle || 'No description'}
                              </p>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => toggleSlideStatus(index)}
                                className={`px-2 py-1 text-xs rounded-full ${
                                  slide.isActive 
                                    ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                }`}
                              >
                                {slide.isActive ? 'Active' : 'Inactive'}
                              </button>
                            </div>
                          </div>
                          
                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {slide.textPosition}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {slide.animationType}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              {slide.buttonStyle}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Overlay: {slide.overlayOpacity}%
                            </span>
                          </div>
                          
                          <div className="mt-4 flex space-x-2">
                            <button
                              onClick={() => handleEdit(index)}
                              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                            >
                              <FiEdit2 size={14} /> Edit
                            </button>
                            <button
                              onClick={() => handleDelete(index)}
                              className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
                            >
                              <FiTrash2 size={14} /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeroEditor;