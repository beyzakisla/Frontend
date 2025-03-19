const BASE_URL = "https://ai.aquai.tech/api/v1/lakes";

const LakeService = {

  getLakesList: async () => {
    try {
      const response = await fetch(`${BASE_URL}`);
      if (!response.ok) {
        throw new Error("Failed to fetch lakes list");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching lakes list:", error);
      throw error;
    }
  },

  // Gölün detay verilerini almak
  getLakeData: async (lakeId) => {
    try {
      const response = await fetch(`https://ai.aquai.tech/api/v1/lakes/data?gol=${lakeId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch lake data");
      }
      return await response.json(); 
    } catch (error) {
      console.error("Error fetching lake data:", error);
      throw error;
    }
  },

  getLakePolygons: async (lakeId) => {
    try {
      const response = await fetch(`https://ai.aquai.tech/api/v1/lakes/polygon?gol=${lakeId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch lake polygon data");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching lake polygon data:", error);
      throw error;
    }
  },
  
  getLakeGraph: async (lakeId) => {
    try {
      const response = await fetch(`https://ai.aquai.tech/api/v1/lakes/graph?gol=${lakeId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch lake graph data");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching lake graph data:", error);
      throw error;
    }
  }
};


export default LakeService
