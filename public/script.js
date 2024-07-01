document.addEventListener('DOMContentLoaded', () => {
  const uploadForm = document.getElementById('upload-form')
  const uploadPage = document.getElementById('upload-page')
  const previewPage = document.getElementById('preview-page')
  const videoGrid = document.getElementById('video-grid')

  uploadForm.addEventListener('submit', function (e) {
    e.preventDefault()
    const title = document.getElementById('title').value
    const thumbnailFile = document.getElementById('thumbnail').files[0]

    if (title && thumbnailFile) {
      const reader = new FileReader()
      reader.onload = function (event) {
        const thumbnailUrl = event.target.result
        addCustomVideoToGrid({ title, thumbnailUrl })
        uploadPage.classList.add('hidden')
        previewPage.classList.remove('hidden')
      }
      reader.readAsDataURL(thumbnailFile)
    }
  })

  function addCustomVideoToGrid(video) {
    const videoElement = document.createElement('div')
    videoElement.className = 'bg-[#0f0f0f] rounded-lg overflow-hidden'
    videoElement.innerHTML = `
          <img src="${video.thumbnailUrl}" alt="Thumbnail" class="w-full h-48 object-cover">
          <div class="p-2">
              <h3 class="font-bold text-sm">${video.title}</h3>
              <p class="text-gray-400 text-xs">Seu Canal</p>
              <p class="text-gray-400 text-xs">0 visualizações • agora</p>
          </div>
      `
    videoGrid.prepend(videoElement)
  }

  async function fetchYouTubeVideos() {
    try {
      const response = await fetch('/api/videos')
      const data = await response.json()
      data.items.forEach(video => addVideoToGrid(video))
    } catch (error) {
      console.error('Erro ao buscar vídeos do YouTube:', error)
    }
  }

  function addVideoToGrid(video) {
    const videoElement = document.createElement('div')
    videoElement.className = 'bg-[#0f0f0f] rounded-lg overflow-hidden'
    videoElement.innerHTML = `
          <img src="${
            video.snippet.thumbnails.medium.url
          }" alt="Thumbnail" class="w-full h-48 object-cover">
          <div class="p-2">
              <h3 class="font-bold text-sm">${video.snippet.title}</h3>
              <p class="text-gray-400 text-xs">${video.snippet.channelTitle}</p>
              <p class="text-gray-400 text-xs">${formatViewCount(
                video.statistics.viewCount
              )} visualizações • ${formatPublishedAt(
      video.snippet.publishedAt
    )}</p>
              <p class="text-gray-400 text-xs">${formatDuration(
                video.contentDetails.duration
              )}</p>
          </div>
      `
    videoGrid.appendChild(videoElement)
  }

  function formatViewCount(viewCount) {
    if (viewCount >= 1000000) {
      return (viewCount / 1000000).toFixed(1) + 'M'
    } else if (viewCount >= 1000) {
      return (viewCount / 1000).toFixed(1) + 'K'
    } else {
      return viewCount
    }
  }

  function formatPublishedAt(publishedAt) {
    const now = new Date()
    const published = new Date(publishedAt)
    const diffTime = Math.abs(now - published)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      return 'há 1 dia'
    } else if (diffDays < 7) {
      return `há ${diffDays} dias`
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7)
      return `há ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`
    } else {
      const months = Math.floor(diffDays / 30)
      return `há ${months} ${months === 1 ? 'mês' : 'meses'}`
    }
  }

  function formatDuration(duration) {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
    const hours = (parseInt(match[1]) || 0).toString().padStart(2, '0')
    const minutes = (parseInt(match[2]) || 0).toString().padStart(2, '0')
    const seconds = (parseInt(match[3]) || 0).toString().padStart(2, '0')
    return `${hours}:${minutes}:${seconds}`
  }

  fetchYouTubeVideos()
})
