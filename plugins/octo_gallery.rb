require 'mini_magick'

module Jekyll
  class OctoGallery < Liquid::Block
    def initialize(tag_name, markup, tokens)
      base_path = 'source/images/'
      @images   = tokens[0].strip.split("\n")
      @thumbed_images = []

      @images.each do |file|
        #remove prefixed slashes
        file.slice!(0) if file[0] == '/'
        dir       = File.dirname(file)
        extension = File.extname(file)
        name      = File.basename(file, extension)

        thumbed_image = "#{dir}/#{name}-thumb#{extension}"

        unless File.exists?("#{base_path}#{thumbed_image}")
          print "generating thumb for #{file}..."
          image = MiniMagick::Image.open("#{base_path}#{file}")
          image.resize  "100x100^"
          width, height = image[:dimensions]
          if width > height
            image.crop "100x100+#{(width-100)/2}+0"
          elsif width < height
            image.crop "100x100+0+#{(height-100)/2}"
          end
          image.write  "#{base_path}#{thumbed_image}"
          puts "done!"
        end

        @thumbed_images << thumbed_image
      end

      super
    end

    def render(context)
      out = '' #'<a class="octogallery" href="hello"><img src="hello.jpg"></a>'
      @images.each_index do |i|
        out << <<-EOF
<a class="octogallery" href="/images/#{@images[i]}">
  <img src="/images/#{@thumbed_images[i]}">
</a>
        EOF
      end

      out
    end
  end
end

Liquid::Template.register_tag('octogallery', Jekyll::OctoGallery)


# class Random < Liquid::Block
#   def initialize(tag_name, markup, tokens)
#      super
#      @rand = markup.to_i
#   end

#   def render(context)
#     if rand(@rand) == 0
#        super
#     else
#        ''
#     end
#   end
# end

# Liquid::Template.register_tag('random', Random)
